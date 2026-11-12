// Tests du solveur (modèle v5_5). Lancer avec : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import loadHighs from "highs";
import { resoudre, validerInstance, construireLP, lireResultat, LIMITES } from "../src/lib/solveur/modele.js";

const highs = await loadHighs();

// Exemple de référence du document v5_5, lu dans la copie du fichier commun
// (Delegation_Argon4/format_entree_solveur/instance_reference_v5_5.json).
const fichierReference = JSON.parse(readFileSync(new URL("./donnees/instance_reference_v5_5.json", import.meta.url), "utf8"));
const { resultat_attendu: attenduReference, nom: _nom, ...reference } = fichierReference;

// Évaluation directe d'un plan, sans solveur ni code du site : renvoie { valeur, soldes }, ou null
// s'il viole (2) à (5). Indépendante de modele.js, pour que les tests vérifient vraiment le solveur.
function evaluer(inst, plan) {
  const { h, S0, Smin, delta, D, taches } = inst;
  const mois = new Map(taches.map((t, k) => [t.id, plan[k]])); // 0 = non lancée
  let S = S0;
  const soldes = [];
  for (let t = 1; t <= h; t++) {
    S += D[t - 1] - taches.reduce((s, tache, k) => s + (plan[k] === t ? tache.cout : 0), 0);
    if (S < Smin - 1e-9) return null;
    soldes.push(S);
  }
  for (const [i, j] of inst.precedences) {
    const mj = mois.get(j);
    if (mj === 0) continue;
    const mi = mois.get(i);
    const di = taches.find((t) => t.id === i).duree;
    if (mi === 0 || mi > mj - di) return null;
  }
  const valeur = taches.reduce((v, tache, k) => v + (plan[k] ? tache.poids / Math.pow(1 + delta, plan[k] - 1) : 0), 0);
  return { valeur, soldes };
}

// Tous les plans réalisables, du meilleur au moins bon.
function enumerer(inst) {
  const n = inst.taches.length;
  const plans = [];
  const plan = new Array(n).fill(0);
  const suivant = (k) => {
    if (k === n) {
      const r = evaluer(inst, plan);
      if (r !== null) plans.push(r);
      return;
    }
    for (let m = 0; m <= inst.h; m++) {
      plan[k] = m;
      suivant(k + 1);
    }
  };
  suivant(0);
  return plans.sort((a, b) => b.valeur - a.valeur);
}

const planDe = (inst, r) => inst.taches.map((t) => r.lancements.find((l) => l.id === t.id)?.mois ?? 0);
const proche = (a, b, e = 1e-6) => Math.abs(a - b) <= e;

// Compare le solveur à l'énumération : même valeur, plan rendu réalisable, soldes exacts.
function verifierContreEnumeration(inst, etiquette) {
  const meilleur = enumerer(inst)[0];
  const r = resoudre(highs, inst);
  assert.equal(r.statut, "optimal", `${etiquette} : statut ${r.statut} ${JSON.stringify(r.erreurs ?? "")}`);
  assert.ok(proche(r.valeur, meilleur.valeur), `${etiquette} : ${r.valeur} au lieu de ${meilleur.valeur}`);
  const verifie = evaluer(inst, planDe(inst, r));
  assert.ok(verifie !== null && proche(verifie.valeur, r.valeur), `${etiquette} : plan rendu non réalisable`);
  verifie.soldes.forEach((s, t) => assert.ok(proche(s, r.soldes[t], 0.01), `${etiquette} : solde du mois ${t + 1}`));
}

let graine = 7;
const alea = () => ((graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648);

// ---------------------------------------------------------------- exemple de référence

test("exemple de référence : résultat attendu du fichier commun (optimum 15,61)", () => {
  const r = resoudre(highs, reference);
  assert.equal(r.statut, "optimal");
  assert.equal(Math.round(r.valeur * 100) / 100, attenduReference.valeur);
  assert.ok(proche(r.valeur, 9 + 8 / 1.21));
  assert.deepEqual(r.lancements, attenduReference.lancements);
  assert.deepEqual(r.soldes, attenduReference.soldes);
});

test("exemple de référence : 16 plans réalisables sur 64, valeurs du document v5_5", () => {
  const valeurs = enumerer(reference).map((p) => Math.round(p.valeur * 100) / 100);
  assert.equal(valeurs.length, attenduReference.nb_plans_realisables);
  assert.deepEqual(valeurs, [15.61, 15.36, 15.18, 14.79, 14.55, 14.44, 13.97, 13.8, 13.22, 9, 8.18, 7.44, 7, 6.36, 5.79, 0]);
});

test("solde de départ sous la réserve, sans don : aucun plan réalisable", () => {
  assert.equal(resoudre(highs, { ...reference, S0: 100, D: [0, 0, 0] }).statut, "infaisable");
});

// ---------------------------------------------------------------- cas particuliers du modèle

test("h = 1 sans précédence : même optimum qu'un sac à dos 0-1", () => {
  const inst = {
    h: 1, S0: 500, Smin: 100, delta: 0.1, D: [400],
    taches: [
      { id: 1, cout: 300, duree: 1, poids: 5 },
      { id: 2, cout: 400, duree: 1, poids: 6 },
      { id: 3, cout: 500, duree: 1, poids: 8 },
      { id: 4, cout: 200, duree: 1, poids: 3 },
    ],
    precedences: [],
  };
  const Q = inst.S0 + inst.D[0] - inst.Smin;
  const f = new Array(Q + 1).fill(0);
  for (const t of inst.taches) for (let q = Q; q >= t.cout; q--) f[q] = Math.max(f[q], f[q - t.cout] + t.poids);
  assert.ok(proche(resoudre(highs, inst).valeur, f[Q]));
});

test("une tâche plus longue que l'horizon peut être lancée au dernier mois", () => {
  // L'argent n'arrive qu'au mois 2 ; la tâche dure 3 mois et finit donc après h = 2.
  const inst = { h: 2, S0: 0, Smin: 0, delta: 0.1, D: [0, 500], taches: [{ id: 1, cout: 500, duree: 3, poids: 4 }], precedences: [] };
  const r = resoudre(highs, inst);
  assert.deepEqual(r.lancements, [{ id: 1, mois: 2 }]);
});

test("un successeur ne peut pas être lancé si son prédécesseur finit après l'horizon", () => {
  // A (durée 2) ne peut démarrer qu'au mois 2 faute d'argent : il finit au mois 3, B devrait démarrer au mois 4 > h.
  const inst = {
    h: 3, S0: 0, Smin: 0, delta: 0.1, D: [0, 1000, 1000],
    taches: [{ id: 1, cout: 1000, duree: 2, poids: 1 }, { id: 2, cout: 500, duree: 1, poids: 10 }],
    precedences: [[1, 2]],
  };
  const r = resoudre(highs, inst);
  assert.equal(r.statut, "optimal");
  assert.ok(!r.lancements.some((l) => l.id === 2), JSON.stringify(r.lancements));
  verifierContreEnumeration(inst, "successeur bloqué");
});

test("chaîne de précédences et prédécesseurs multiples : même optimum que l'énumération", () => {
  const inst = {
    h: 4, S0: 800, Smin: 100, delta: 0.1, D: [300, 300, 300, 300],
    taches: [
      { id: 1, cout: 400, duree: 1, poids: 3 },
      { id: 2, cout: 300, duree: 2, poids: 5 },
      { id: 3, cout: 500, duree: 1, poids: 9 },
      { id: 4, cout: 200, duree: 1, poids: 4 },
    ],
    precedences: [[1, 2], [2, 3], [1, 3], [2, 4]],
  };
  verifierContreEnumeration(inst, "chaîne");
});

test("taux d'urgence nul : tous les mois se valent", () => {
  const inst = { ...reference, delta: 0 };
  verifierContreEnumeration(inst, "delta = 0");
  assert.ok(proche(resoudre(highs, inst).valeur, 9 + 8));
});

test("réserve atteinte exactement : permis ; un centime de moins : refusé", () => {
  const base = { h: 1, S0: 1000, Smin: 200, delta: 0, D: [0], precedences: [] };
  const juste = resoudre(highs, { ...base, taches: [{ id: 1, cout: 800, duree: 1, poids: 1 }] });
  assert.deepEqual(juste.lancements, [{ id: 1, mois: 1 }]);
  assert.deepEqual(juste.soldes, [200]);
  const trop = resoudre(highs, { ...base, taches: [{ id: 1, cout: 800.01, duree: 1, poids: 1 }] });
  assert.deepEqual(trop.lancements, []);
});

test("montants à décimales : même optimum que l'énumération", () => {
  const inst = {
    h: 3, S0: 0.3, Smin: 0, delta: 0.07, D: [333.33, 333.33, 333.34],
    taches: [
      { id: 1, cout: 0.1, duree: 1, poids: 1.5 },
      { id: 2, cout: 0.2, duree: 1, poids: 2.25 },
      { id: 3, cout: 666.66, duree: 2, poids: 7.1 },
      { id: 4, cout: 333.63, duree: 1, poids: 3.3 },
    ],
    precedences: [[1, 3]],
  };
  verifierContreEnumeration(inst, "décimales");
});

// ---------------------------------------------------------------- écriture des nombres (audit C1)

test("petits coefficients : le poids 5e-10 n'est pas écrit 0,5", () => {
  const inst = {
    h: 1, S0: 100, Smin: 0, delta: 0, D: [0],
    taches: [{ id: 1, cout: 100, duree: 1, poids: 5e-10 }, { id: 2, cout: 100, duree: 1, poids: 0.01 }],
    precedences: [],
  };
  const r = resoudre(highs, inst);
  assert.deepEqual(r.lancements, [{ id: 2, mois: 1 }]);
  assert.ok(proche(r.valeur, 0.01));
});

test("delta = 1 sur 36 mois : chaque coefficient du programme égale sa valeur vraie", () => {
  const inst = { h: 36, S0: 10, Smin: 0, delta: 1, D: new Array(36).fill(0), taches: [{ id: 1, cout: 1, duree: 1, poids: 1 }], precedences: [] };
  const objectif = construireLP(inst).split("\n")[1];
  const coefficients = [...objectif.matchAll(/([0-9.e+-]+) x_0_(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.equal(coefficients.length, 36);
  for (const [c, t] of coefficients) assert.equal(c, 1 / Math.pow(2, t - 1), `mois ${t}`);
});

// ---------------------------------------------------------------- lecture du résultat

test("lecture du résultat : limite de temps avec et sans plan, infaisable, plan incohérent", () => {
  const colonnes = { x_0_1: { Primal: 1 }, x_0_2: { Primal: 0 }, x_0_3: { Primal: 0 }, x_1_1: { Primal: 0 }, x_1_2: { Primal: 0 }, x_1_3: { Primal: 1 }, x_2_1: { Primal: 0 }, x_2_2: { Primal: 0 }, x_2_3: { Primal: 0 } };
  const avecPlan = lireResultat(reference, { Status: "Time limit reached", ObjectiveValue: 15.6, Columns: colonnes }, 30);
  assert.equal(avecPlan.statut, "limite_temps");
  assert.deepEqual(avecPlan.soldes, [800, 1400, 500]);
  assert.equal(lireResultat(reference, { Status: "Time limit reached", ObjectiveValue: Infinity, Columns: colonnes }, 30).statut, "limite_temps_sans_plan");
  assert.equal(lireResultat(reference, { Status: "Infeasible" }, 1).statut, "infaisable");
  // Plan qui viole la réserve (toiture et pompe au mois 1) : refusé même si le solveur le dit optimal.
  const faux = { ...colonnes, x_1_3: { Primal: 0 }, x_2_1: { Primal: 1 } };
  const r = lireResultat(reference, { Status: "Optimal", ObjectiveValue: 16, Columns: faux }, 1);
  assert.equal(r.statut, "erreur");
  assert.equal(r.erreurs[0].code, "plan_incoherent");
});

// ---------------------------------------------------------------- validation

test("validation : instances invalides refusées avec un code d'erreur", () => {
  const codes = (inst) => validerInstance(inst).map((e) => e.code);
  assert.deepEqual(validerInstance(reference), []);
  assert.deepEqual(codes(null), ["instance"]);
  assert.ok(codes({ ...reference, h: 2.5 }).includes("h"));
  assert.ok(codes({ ...reference, h: 0 }).includes("h"));
  assert.ok(codes({ ...reference, h: 37 }).includes("h"));
  assert.ok(codes({ ...reference, S0: -1 }).includes("nombre"));
  assert.ok(codes({ ...reference, delta: NaN }).includes("nombre"));
  assert.ok(codes({ ...reference, delta: 10 }).includes("delta_max"));
  assert.ok(codes({ ...reference, D: [1, 2] }).includes("D"));
  assert.ok(codes({ ...reference, D: [1e12, 0, 0] }).includes("D"));
  assert.ok(codes({ ...reference, taches: [] }).includes("nb_taches"));
  assert.ok(codes({ ...reference, taches: new Array(LIMITES.taches + 1).fill(reference.taches[0]) }).includes("nb_taches"));
  assert.ok(codes({ ...reference, taches: [null, ...reference.taches] }).includes("tache_objet"));
  assert.ok(codes({ ...reference, taches: [...reference.taches, { ...reference.taches[0] }] }).includes("id_double"));
  assert.ok(codes({ ...reference, taches: [{ ...reference.taches[0], id: "1" }, ...reference.taches.slice(1)] }).includes("id"));
  assert.ok(codes({ ...reference, taches: [{ ...reference.taches[0], cout: 1e21 }, ...reference.taches.slice(1)] }).includes("cout"));
  assert.ok(codes({ ...reference, taches: [{ ...reference.taches[0], poids: 1.5e20 }, ...reference.taches.slice(1)] }).includes("poids"));
  assert.ok(codes({ ...reference, precedences: "abc" }).includes("precedences_liste"));
  assert.ok(codes({ ...reference, precedences: { a: 1 } }).includes("precedences_liste"));
  assert.ok(codes({ ...reference, precedences: [[1, 9]] }).includes("precedence"));
  assert.ok(codes({ ...reference, precedences: [[1, 1]] }).includes("boucle"));
  assert.ok(codes({ ...reference, precedences: [[1, 2], [1, 2]] }).includes("precedence_double"));
  assert.ok(codes({ ...reference, precedences: [[1, 2], [2, 1]] }).includes("cycle"));
  assert.ok(codes({ ...reference, precedences: new Array(LIMITES.precedences + 1).fill([1, 2]) }).includes("nb_precedences"));
});

test("validation : le nombre de messages est borné", () => {
  const taches = Array.from({ length: 150 }, (_, k) => ({ id: k + 1, cout: -1, duree: 0, poids: -1 }));
  const e = validerInstance({ ...reference, taches, precedences: [] });
  assert.ok(e.length <= LIMITES.messages + 1, `${e.length} messages`);
});

// ---------------------------------------------------------------- instances aléatoires

test("instances aléatoires (4 tâches, 3 mois) : même optimum que l'énumération", () => {
  for (let essai = 0; essai < 25; essai++) {
    const taches = Array.from({ length: 4 }, (_, k) => ({
      id: k + 1, cout: 100 + Math.floor(alea() * 900), duree: 1 + Math.floor(alea() * 2), poids: 1 + Math.floor(alea() * 9),
    }));
    const precedences = [];
    for (let i = 1; i <= 4; i++) for (let j = i + 1; j <= 4; j++) if (alea() < 0.25) precedences.push([i, j]);
    const inst = { h: 3, S0: 300 + Math.floor(alea() * 900), Smin: 100, delta: 0.1, D: [0, 0, 0].map(() => Math.floor(alea() * 700)), taches, precedences };
    verifierContreEnumeration(inst, `essai ${essai}`);
  }
});

test("instances aléatoires plus grandes (5 tâches, 4 mois, décimales, delta variable)", () => {
  for (let essai = 0; essai < 12; essai++) {
    const taches = Array.from({ length: 5 }, (_, k) => ({
      id: k + 1, cout: Math.round((50 + alea() * 950) * 100) / 100, duree: 1 + Math.floor(alea() * 4), poids: Math.round(alea() * 1000) / 100,
    }));
    const precedences = [];
    for (let i = 1; i <= 5; i++) for (let j = i + 1; j <= 5; j++) if (alea() < 0.2) precedences.push([i, j]);
    const delta = essai % 4 === 0 ? 0 : Math.round(alea() * 50) / 100;
    const inst = { h: 4, S0: Math.round(alea() * 120000) / 100, Smin: 50, delta, D: [0, 0, 0, 0].map(() => Math.round(alea() * 60000) / 100), taches, precedences };
    verifierContreEnumeration(inst, `grand essai ${essai}`);
  }
});

test("taille du cahier des charges : 25 tâches sur 12 mois, optimum prouvé", () => {
  let g = 42;
  const a = () => ((g = (g * 1103515245 + 12345) % 2147483648) / 2147483648);
  const taches = Array.from({ length: 25 }, (_, k) => ({
    id: k + 1, cout: 300 + Math.floor(a() * 4700), duree: 1 + Math.floor(a() * 3), poids: 1 + Math.round(a() * 90) / 10,
  }));
  const precedences = [];
  for (let i = 1; i <= 25; i++) for (let j = i + 1; j <= 25; j++) if (a() < 0.08) precedences.push([i, j]);
  const inst = { h: 12, S0: 3000, Smin: 500, delta: 0.1, D: Array.from({ length: 12 }, () => 1500 + Math.floor(a() * 2000)), taches, precedences };
  // Limite large : ce test vérifie le résultat, pas la vitesse de la machine. Le temps est seulement affiché.
  const r = resoudre(highs, inst, { limiteTempsS: 300 });
  assert.equal(r.statut, "optimal");
  console.log(`  25 tâches, 12 mois, ${precedences.length} précédences : ${r.temps_calcul_s} s, valeur ${r.valeur}`);
});
