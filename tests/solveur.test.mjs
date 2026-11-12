// Tests du solveur (modèle v5_5). Lancer avec : npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import loadHighs from "highs";
import { resoudre, validerInstance, construireLP } from "../src/lib/solveur/modele.js";

const highs = await loadHighs();

// Exemple de référence du document v5_5 (identique à Delegation_Argon4/format_entree_solveur).
const reference = {
  h: 3, S0: 1200, Smin: 200, delta: 0.1, D: [600, 600, 600],
  taches: [
    { id: 1, libelle: "toiture", cout: 1000, duree: 2, poids: 9 },
    { id: 2, libelle: "frigo", cout: 1500, duree: 1, poids: 8 },
    { id: 3, libelle: "pompe", cout: 800, duree: 1, poids: 7 },
  ],
  precedences: [[1, 2]],
};

// Évaluation directe d'un plan, sans solveur : renvoie sa valeur, ou null s'il viole (2) à (5).
function evaluer(inst, plan) {
  const { h, S0, Smin, delta, D, taches } = inst;
  const mois = new Map(taches.map((t, k) => [t.id, plan[k]])); // 0 = non lancée
  let S = S0;
  for (let t = 1; t <= h; t++) {
    S += D[t - 1] - taches.reduce((s, tache, k) => s + (plan[k] === t ? tache.cout : 0), 0);
    if (S < Smin - 1e-9) return null;
  }
  for (const [i, j] of inst.precedences) {
    const mj = mois.get(j);
    if (mj === 0) continue;
    const mi = mois.get(i);
    const di = taches.find((t) => t.id === i).duree;
    if (mi === 0 || mi > mj - di) return null;
  }
  return taches.reduce((v, tache, k) => v + (plan[k] ? tache.poids / Math.pow(1 + delta, plan[k] - 1) : 0), 0);
}

function enumerer(inst) {
  const n = inst.taches.length;
  const valeurs = [];
  const plan = new Array(n).fill(0);
  const suivant = (k) => {
    if (k === n) {
      const v = evaluer(inst, plan);
      if (v !== null) valeurs.push(v);
      return;
    }
    for (let m = 0; m <= inst.h; m++) {
      plan[k] = m;
      suivant(k + 1);
    }
  };
  suivant(0);
  return valeurs.sort((a, b) => b - a);
}

test("exemple de référence : optimum 15,61, toiture au mois 1, frigo au mois 3", () => {
  const r = resoudre(highs, reference);
  assert.equal(r.statut, "optimal");
  assert.equal(Math.round(r.valeur * 100) / 100, 15.61);
  assert.ok(Math.abs(r.valeur - (9 + 8 / 1.21)) < 1e-6);
  assert.deepEqual(r.lancements, [{ id: 1, mois: 1 }, { id: 2, mois: 3 }]);
  assert.deepEqual(r.soldes, [800, 1400, 500]);
});

test("exemple de référence : 16 plans réalisables sur 64, valeurs du document v5_5", () => {
  const valeurs = enumerer(reference).map((v) => Math.round(v * 100) / 100);
  assert.deepEqual(valeurs, [15.61, 15.36, 15.18, 14.79, 14.55, 14.44, 13.97, 13.8, 13.22, 9, 8.18, 7.44, 7, 6.36, 5.79, 0]);
});

test("solde de départ sous la réserve : aucun plan réalisable", () => {
  const r = resoudre(highs, { ...reference, S0: 100, D: [0, 0, 0] });
  assert.equal(r.statut, "infaisable");
});

test("h = 1 sans précédence : même optimum qu'un sac à dos 0-1", () => {
  const inst = {
    h: 1, S0: 500, Smin: 100, delta: 0.1, D: [400],
    taches: [
      { id: "a", cout: 300, duree: 1, poids: 5 },
      { id: "b", cout: 400, duree: 1, poids: 6 },
      { id: "c", cout: 500, duree: 1, poids: 8 },
      { id: "d", cout: 200, duree: 1, poids: 3 },
    ],
    precedences: [],
  };
  // Programmation dynamique sur la capacité Q = S0 + D1 - Smin
  const Q = inst.S0 + inst.D[0] - inst.Smin;
  const f = new Array(Q + 1).fill(0);
  for (const t of inst.taches) for (let q = Q; q >= t.cout; q--) f[q] = Math.max(f[q], f[q - t.cout] + t.poids);
  assert.equal(resoudre(highs, inst).valeur, f[Q]);
});

test("instances aléatoires : le solveur trouve le même optimum que l'énumération", () => {
  let graine = 7;
  const alea = () => ((graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let essai = 0; essai < 25; essai++) {
    const n = 4;
    const taches = Array.from({ length: n }, (_, k) => ({
      id: k + 1, cout: 100 + Math.floor(alea() * 900), duree: 1 + Math.floor(alea() * 2), poids: 1 + Math.floor(alea() * 9),
    }));
    const precedences = [];
    for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) if (alea() < 0.25) precedences.push([i, j]);
    const inst = { h: 3, S0: 300 + Math.floor(alea() * 900), Smin: 100, delta: 0.1, D: [0, 0, 0].map(() => Math.floor(alea() * 700)), taches, precedences };
    const attendu = enumerer(inst)[0];
    const r = resoudre(highs, inst);
    assert.equal(r.statut, "optimal", `essai ${essai}`);
    assert.ok(Math.abs(r.valeur - attendu) < 1e-6, `essai ${essai} : ${r.valeur} au lieu de ${attendu}`);
    const verifie = evaluer(inst, taches.map((t) => r.lancements.find((l) => l.id === t.id)?.mois ?? 0));
    assert.ok(verifie !== null && Math.abs(verifie - r.valeur) < 1e-6, `essai ${essai} : plan rendu non réalisable`);
  }
});

test("validation : cycle, doublon, D de mauvaise longueur", () => {
  assert.match(validerInstance({ ...reference, precedences: [[1, 2], [2, 1]] }).join(), /cycle/);
  assert.match(validerInstance({ ...reference, taches: [...reference.taches, reference.taches[0]] }).join(), /double/);
  assert.match(validerInstance({ ...reference, D: [1, 2] }).join(), /D doit/);
  assert.equal(validerInstance(reference).length, 0);
});

test("une tâche peut démarrer même si elle finit après l'horizon", () => {
  const lp = construireLP(reference);
  assert.match(lp, /x_0_3/); // toiture (durée 2) lançable au mois 3
});

test("taille du cahier des charges : 25 tâches sur 12 mois, optimum prouvé dans la limite de 30 s de l'interface", () => {
  let graine = 42;
  const alea = () => ((graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648);
  const taches = Array.from({ length: 25 }, (_, k) => ({
    id: k + 1, cout: 300 + Math.floor(alea() * 4700), duree: 1 + Math.floor(alea() * 3), poids: 1 + Math.round(alea() * 90) / 10,
  }));
  const precedences = [];
  for (let i = 1; i <= 25; i++) for (let j = i + 1; j <= 25; j++) if (alea() < 0.08) precedences.push([i, j]);
  const inst = { h: 12, S0: 3000, Smin: 500, delta: 0.1, D: Array.from({ length: 12 }, () => 1500 + Math.floor(alea() * 2000)), taches, precedences };
  const r = resoudre(highs, inst);
  assert.equal(r.statut, "optimal");
  assert.ok(r.temps_calcul_s < 30, `${r.temps_calcul_s} s`);
  console.log(`  25 tâches, 12 mois, ${precedences.length} précédences : ${r.temps_calcul_s} s, valeur ${r.valeur}`);
});
