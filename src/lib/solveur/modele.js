// Modèle d'optimisation v5_5 (ReponsesClaude/CB3_modele_formel_v5_5.pdf), écrit au format LP de HiGHS.
//
//   max  somme_i somme_{t dans H} w_i / (1+delta)^(t-1) * x[i,t]                 (1)
//   s.c. somme_{t dans H} x[i,t] <= 1                         pour toute tâche i  (2)
//        S[t] = S[t-1] + D_t - somme_i c_i x[i,t],  S[0] = S0  pour tout t de H    (3)
//        S[t] >= Smin                                          pour tout t de H    (4)
//        x[j,t] <= somme_{tau <= t - d_i} x[i,tau]             pour (i,j) dans A   (5)
//        x binaire                                                                 (6)
//
// Une tâche peut démarrer à tout mois de H, même si elle finit après h (décision du 27/10/2026).
// Ce fichier ne dépend pas de HiGHS : il sert aussi aux tests et au format d'entrée commun
// (Delegation_Argon4/format_entree_solveur/FORMAT.md).

// Limites techniques : elles protègent le navigateur contre des instances démesurées
// (fichier importé malveillant ou faute de frappe) sans gêner les vrais usages.
export const LIMITES = {
  taches: 200,
  horizon: 36,
  precedences: 1000,
  montant: 1e9, // S0, Smin, D_t, c_i
  poids: 1e6,
  delta: 1, // au-delà, (1+delta)^(t-1) écrase les mois lointains : presque sûrement une faute de frappe
  messages: 20,
};

const estNombre = (v) => typeof v === "number" && Number.isFinite(v);
const estObjet = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// Vérifie une instance. Renvoie une liste d'erreurs { code, ...paramètres } ; liste vide = instance valide.
// Les textes affichés sont dans les dictionnaires de l'espace de gestion (clé plan.erreurs).
export function validerInstance(inst) {
  const e = [];
  const ajouter = (code, params = {}) => e.push({ code, ...params });
  if (!estObjet(inst)) return [{ code: "instance" }];

  if (!Number.isInteger(inst.h) || inst.h < 1 || inst.h > LIMITES.horizon) ajouter("h", { max: LIMITES.horizon });
  for (const champ of ["S0", "Smin", "delta"]) {
    if (!estNombre(inst[champ]) || inst[champ] < 0) ajouter("nombre", { champ });
  }
  if (estNombre(inst.delta) && inst.delta > LIMITES.delta) ajouter("delta_max", { max: LIMITES.delta });
  for (const champ of ["S0", "Smin"]) {
    if (estNombre(inst[champ]) && inst[champ] > LIMITES.montant) ajouter("montant_max", { champ, max: LIMITES.montant });
  }
  if (!Array.isArray(inst.D) || inst.D.length !== inst.h || !inst.D.every((d) => estNombre(d) && d >= 0 && d <= LIMITES.montant)) {
    ajouter("D", { max: LIMITES.montant });
  }

  const taches = inst.taches;
  if (!Array.isArray(taches) || taches.length === 0 || taches.length > LIMITES.taches) {
    ajouter("nb_taches", { max: LIMITES.taches });
    return e; // inutile (et coûteux) de parcourir une liste absente ou démesurée
  }
  const ids = new Set();
  for (let k = 0; k < taches.length && e.length < LIMITES.messages; k++) {
    const t = taches[k];
    if (!estObjet(t)) {
      ajouter("tache_objet", { index: k + 1 });
      continue;
    }
    if (!Number.isInteger(t.id)) ajouter("id", { index: k + 1 });
    else if (ids.has(t.id)) ajouter("id_double", { id: t.id });
    ids.add(t.id);
    if (!estNombre(t.cout) || t.cout < 0 || t.cout > LIMITES.montant) ajouter("cout", { id: t.id, max: LIMITES.montant });
    if (!Number.isInteger(t.duree) || t.duree < 1) ajouter("duree", { id: t.id });
    if (!estNombre(t.poids) || t.poids < 0 || t.poids > LIMITES.poids) ajouter("poids", { id: t.id, max: LIMITES.poids });
  }

  const prec = inst.precedences ?? [];
  if (!Array.isArray(prec)) ajouter("precedences_liste");
  else if (prec.length > LIMITES.precedences) ajouter("nb_precedences", { max: LIMITES.precedences });
  else {
    const vues = new Set();
    for (const p of prec) {
      if (e.length >= LIMITES.messages) break;
      if (!Array.isArray(p) || p.length !== 2 || !ids.has(p[0]) || !ids.has(p[1])) {
        ajouter("precedence", { valeur: JSON.stringify(p).slice(0, 40) });
      } else if (p[0] === p[1]) ajouter("boucle", { id: p[0] });
      else if (vues.has(`${p[0]}>${p[1]}`)) ajouter("precedence_double", { valeur: `${p[0]} → ${p[1]}` });
      else vues.add(`${p[0]}>${p[1]}`);
    }
    if (e.length === 0 && aUnCycle([...ids], prec)) ajouter("cycle");
  }
  return e.length > LIMITES.messages ? [...e.slice(0, LIMITES.messages), { code: "autres", n: e.length - LIMITES.messages }] : e;
}

function aUnCycle(ids, prec) {
  const suivants = new Map(ids.map((id) => [id, []]));
  for (const [i, j] of prec) suivants.get(i).push(j);
  const etat = new Map(); // 1 = en cours, 2 = terminé
  const visiter = (n) => {
    if (etat.get(n) === 1) return true;
    if (etat.get(n) === 2) return false;
    etat.set(n, 1);
    for (const s of suivants.get(n)) if (visiter(s)) return true;
    etat.set(n, 2);
    return false;
  };
  return ids.some((id) => visiter(id));
}

// Écriture d'un nombre dans le programme LP. String() donne l'écriture la plus courte qui redonne
// exactement le même nombre (par exemple 5e-10), que le lecteur LP de HiGHS accepte.
const nb = (v) => String(v);

// Construit le programme au format LP. Les noms de variables utilisent l'indice de la tâche
// (x_0_1, x_1_3, ...) : aucun identifiant ni libellé saisi ne peut modifier le programme.
export function construireLP(inst) {
  const { h, S0, Smin, delta, D, taches } = inst;
  const index = new Map(taches.map((t, k) => [t.id, k]));
  const x = (k, t) => `x_${k}_${t}`;
  const lignes = [];

  // (1) objectif
  const termes = [];
  taches.forEach((tache, k) => {
    for (let t = 1; t <= h; t++) {
      const coef = tache.poids / Math.pow(1 + delta, t - 1);
      if (coef !== 0) termes.push(`${nb(coef)} ${x(k, t)}`);
    }
  });
  lignes.push("Maximize", ` obj: ${termes.length ? termes.join(" + ") : "0 x_0_1"}`, "Subject To");

  // (2) au plus un lancement par tâche
  taches.forEach((_, k) => {
    const v = [];
    for (let t = 1; t <= h; t++) v.push(x(k, t));
    lignes.push(` une_${k}: ${v.join(" + ")} <= 1`);
  });

  // (3) évolution du solde : S_t - S_{t-1} + somme c_i x_it = D_t   (S_0 est une constante)
  for (let t = 1; t <= h; t++) {
    const depenses = taches.map((tache, k) => `${nb(tache.cout)} ${x(k, t)}`).join(" + ");
    const droite = t === 1 ? S0 + D[0] : D[t - 1];
    const precedent = t === 1 ? "" : ` - S_${t - 1}`;
    lignes.push(` solde_${t}: S_${t}${precedent} + ${depenses} = ${nb(droite)}`);
  }

  // (5) précédences
  for (const [a, b] of inst.precedences ?? []) {
    const i = index.get(a);
    const j = index.get(b);
    const di = taches[i].duree;
    for (let t = 1; t <= h; t++) {
      const avant = [];
      for (let tau = 1; tau <= t - di; tau++) avant.push(`- ${x(i, tau)}`);
      lignes.push(` prec_${i}_${j}_${t}: ${x(j, t)} ${avant.join(" ")} <= 0`.replace(/ +/g, " "));
    }
  }

  // (4) réserve minimale, en bornes
  lignes.push("Bounds");
  for (let t = 1; t <= h; t++) lignes.push(` S_${t} >= ${nb(Smin)}`);

  // (6) variables binaires
  const binaires = [];
  taches.forEach((_, k) => {
    for (let t = 1; t <= h; t++) binaires.push(x(k, t));
  });
  lignes.push("Binary", ` ${binaires.join(" ")}`, "End");
  return lignes.join("\n");
}

// Recalcule un plan sans solveur : soldes (3), réserve (4), au plus un lancement (2), précédences (5)
// et valeur (1). Sert de garde-fou sur la réponse du solveur, et de référence dans les tests.
export function verifierPlan(inst, lancements, tolerance = 1e-6) {
  const mois = new Map();
  for (const l of lancements) {
    if (mois.has(l.id)) return { ok: false, raison: "lancement_double" };
    mois.set(l.id, l.mois);
  }
  const soldes = [];
  let S = inst.S0;
  for (let t = 1; t <= inst.h; t++) {
    S += inst.D[t - 1] - inst.taches.reduce((s, tache) => s + (mois.get(tache.id) === t ? tache.cout : 0), 0);
    if (S < inst.Smin - tolerance) return { ok: false, raison: "reserve", mois: t };
    soldes.push(Math.round(S * 100) / 100);
  }
  for (const [i, j] of inst.precedences ?? []) {
    if (!mois.has(j)) continue;
    const di = inst.taches.find((t) => t.id === i).duree;
    if (!mois.has(i) || mois.get(i) > mois.get(j) - di) return { ok: false, raison: "precedence", taches: [i, j] };
  }
  const valeur = inst.taches.reduce((v, tache) => v + (mois.has(tache.id) ? tache.poids / Math.pow(1 + inst.delta, mois.get(tache.id) - 1) : 0), 0);
  return { ok: true, soldes, valeur };
}

// Transforme la réponse de HiGHS en résultat au format commun.
// Statuts : optimal, limite_temps (plan réalisable non prouvé optimal), limite_temps_sans_plan,
// infaisable, erreur.
export function lireResultat(inst, reponse, tempsCalculS) {
  const limite = /time limit/i.test(reponse.Status);
  if (/infeasible/i.test(reponse.Status)) return { statut: "infaisable", temps_calcul_s: tempsCalculS };
  if (limite && !Number.isFinite(reponse.ObjectiveValue)) return { statut: "limite_temps_sans_plan", temps_calcul_s: tempsCalculS };
  if (reponse.Status !== "Optimal" && !limite) {
    return { statut: "erreur", erreurs: [{ code: "solveur", detail: String(reponse.Status) }], temps_calcul_s: tempsCalculS };
  }
  const lancements = [];
  inst.taches.forEach((tache, k) => {
    for (let t = 1; t <= inst.h; t++) {
      if ((reponse.Columns?.[`x_${k}_${t}`]?.Primal ?? 0) > 0.5) lancements.push({ id: tache.id, mois: t });
    }
  });
  // Garde-fou : on ne rend jamais un plan qui viole une contrainte du modèle.
  const verifie = verifierPlan(inst, lancements);
  if (!verifie.ok) return { statut: "erreur", erreurs: [{ code: "plan_incoherent", detail: verifie.raison }], temps_calcul_s: tempsCalculS };
  return {
    statut: limite ? "limite_temps" : "optimal",
    valeur: Math.round(verifie.valeur * 1e6) / 1e6,
    lancements,
    soldes: verifie.soldes,
    temps_calcul_s: tempsCalculS,
  };
}

// Résout une instance avec une instance de HiGHS déjà chargée (Node ou navigateur).
// Écart d'optimalité nul : « optimal » veut dire prouvé optimal, sans tolérance relative.
export function resoudre(highs, inst, options = {}) {
  const erreurs = validerInstance(inst);
  if (erreurs.length > 0) return { statut: "erreur", erreurs };
  const debut = Date.now();
  const reponse = highs.solve(construireLP(inst), {
    output_flag: false,
    time_limit: options.limiteTempsS ?? 30,
    mip_rel_gap: 0,
    mip_abs_gap: 0,
  });
  return lireResultat(inst, reponse, (Date.now() - debut) / 1000);
}
