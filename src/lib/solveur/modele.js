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

export const LIMITES = { taches: 200, horizon: 36 };

// Vérifie une instance ; renvoie la liste des erreurs (textes en français, pour les journaux).
export function validerInstance(inst) {
  const e = [];
  const estNombre = (v) => typeof v === "number" && Number.isFinite(v);
  if (!Number.isInteger(inst?.h) || inst.h < 1 || inst.h > LIMITES.horizon) e.push(`h doit être un entier entre 1 et ${LIMITES.horizon}`);
  for (const cle of ["S0", "Smin", "delta"]) {
    if (!estNombre(inst?.[cle]) || inst[cle] < 0) e.push(`${cle} doit être un nombre positif ou nul`);
  }
  if (!Array.isArray(inst?.D) || inst.D.length !== inst?.h || !inst.D.every((d) => estNombre(d) && d >= 0)) {
    e.push("D doit contenir exactement h montants positifs ou nuls");
  }
  const taches = Array.isArray(inst?.taches) ? inst.taches : [];
  if (taches.length === 0 || taches.length > LIMITES.taches) e.push(`il faut entre 1 et ${LIMITES.taches} tâches`);
  const ids = new Set();
  for (const t of taches) {
    if (ids.has(t.id)) e.push(`identifiant de tâche en double : ${t.id}`);
    ids.add(t.id);
    if (!estNombre(t.cout) || t.cout < 0) e.push(`coût invalide pour la tâche ${t.id}`);
    if (!Number.isInteger(t.duree) || t.duree < 1) e.push(`durée invalide pour la tâche ${t.id}`);
    if (!estNombre(t.poids) || t.poids < 0) e.push(`poids invalide pour la tâche ${t.id}`);
  }
  const prec = Array.isArray(inst?.precedences) ? inst.precedences : [];
  for (const p of prec) {
    if (!Array.isArray(p) || p.length !== 2 || !ids.has(p[0]) || !ids.has(p[1])) e.push(`précédence invalide : ${JSON.stringify(p)}`);
    else if (p[0] === p[1]) e.push(`une tâche ne peut pas se précéder elle-même : ${p[0]}`);
  }
  if (e.length === 0 && aUnCycle([...ids], prec)) e.push("les précédences forment un cycle");
  return e;
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

const nb = (v) => (Number.isInteger(v) ? String(v) : v.toPrecision(15).replace(/\.?0+$/, ""));

// Construit le programme au format LP. Les noms de variables utilisent l'indice de la tâche
// (x_0_1, x_1_3, ...) pour accepter n'importe quel identifiant.
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

// Transforme la réponse de HiGHS en résultat au format commun.
export function lireResultat(inst, reponse, tempsCalculS) {
  // Limite de temps atteinte avec un plan réalisable : on le rend, marqué « non prouvé optimal ».
  const limite = /time limit/i.test(reponse.Status) && Number.isFinite(reponse.ObjectiveValue) && reponse.Columns?.S_1;
  if (reponse.Status !== "Optimal" && !limite) {
    const infaisable = /infeasible/i.test(reponse.Status);
    return { statut: infaisable ? "infaisable" : "erreur", detail: reponse.Status, temps_calcul_s: tempsCalculS };
  }
  const lancements = [];
  inst.taches.forEach((tache, k) => {
    for (let t = 1; t <= inst.h; t++) {
      if ((reponse.Columns[`x_${k}_${t}`]?.Primal ?? 0) > 0.5) lancements.push({ id: tache.id, mois: t });
    }
  });
  const soldes = [];
  for (let t = 1; t <= inst.h; t++) soldes.push(Math.round(reponse.Columns[`S_${t}`].Primal * 100) / 100);
  return {
    statut: limite ? "limite_temps" : "optimal",
    valeur: Math.round(reponse.ObjectiveValue * 1e6) / 1e6,
    lancements,
    soldes,
    temps_calcul_s: tempsCalculS,
  };
}

// Résout une instance avec une instance de HiGHS déjà chargée (Node ou navigateur).
export function resoudre(highs, inst, options = {}) {
  const erreurs = validerInstance(inst);
  if (erreurs.length > 0) return { statut: "erreur", erreurs };
  const debut = Date.now();
  const reponse = highs.solve(construireLP(inst), { output_flag: false, time_limit: options.limiteTempsS ?? 30 });
  return lireResultat(inst, reponse, (Date.now() - debut) / 1000);
}
