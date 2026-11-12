// Méthode AHP (Saaty) : poids des critères à partir de comparaisons deux à deux,
// puis poids w_i de chaque tâche pour le solveur.
// Même logique que module_ahp/ahp.py (version Python), avec les mêmes valeurs de référence.

// Indice aléatoire de Saaty, pour n = 1 à 10 critères.
export const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
export const SEUIL_COHERENCE = 0.1;

// Construit la matrice réciproque à partir des comparaisons du triangle supérieur.
// comparaisons[i][j] (i < j) = combien le critère i est plus important que j (de 1/9 à 9).
export function matriceDepuisComparaisons(n, comparaisons) {
  const A = Array.from({ length: n }, () => new Array(n).fill(1));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const v = comparaisons?.[i]?.[j] ?? 1;
      A[i][j] = v;
      A[j][i] = 1 / v;
    }
  }
  return A;
}

// Vérifie qu'une matrice est carrée, positive, de diagonale 1 et réciproque.
export function verifierMatrice(A, tolerance = 1e-6) {
  const n = A.length;
  const erreurs = [];
  if (n === 0 || !A.every((ligne) => Array.isArray(ligne) && ligne.length === n)) return ["la matrice n'est pas carrée"];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = A[i][j];
      if (!(typeof v === "number" && Number.isFinite(v) && v > 0)) erreurs.push(`valeur invalide en (${i + 1}, ${j + 1})`);
      else if (i === j && Math.abs(v - 1) > tolerance) erreurs.push(`la diagonale doit valoir 1 en (${i + 1}, ${i + 1})`);
      else if (Math.abs(v * A[j][i] - 1) > tolerance) erreurs.push(`la matrice n'est pas réciproque en (${i + 1}, ${j + 1})`);
    }
  }
  return erreurs;
}

const normaliser = (v) => {
  const s = v.reduce((a, b) => a + b, 0);
  return v.map((x) => x / s);
};

// Vecteur propre de la plus grande valeur propre (méthode de la puissance), normalisé à une somme de 1.
// Pour une matrice positive, le théorème de Perron-Frobenius garantit la convergence.
export function poidsVecteurPropre(A, iterations = 1000, tolerance = 1e-12) {
  const n = A.length;
  let w = new Array(n).fill(1 / n);
  for (let k = 0; k < iterations; k++) {
    const suivant = normaliser(A.map((ligne) => ligne.reduce((s, a, j) => s + a * w[j], 0)));
    const ecart = Math.max(...suivant.map((x, i) => Math.abs(x - w[i])));
    w = suivant;
    if (ecart < tolerance) break;
  }
  const Aw = A.map((ligne) => ligne.reduce((s, a, j) => s + a * w[j], 0));
  const lambdaMax = Aw.reduce((s, x, i) => s + x / w[i], 0) / n;
  return { poids: w, lambdaMax };
}

// Approximation : moyenne géométrique de chaque ligne, puis normalisation.
export function poidsMoyenneGeometrique(A) {
  return normaliser(A.map((ligne) => Math.exp(ligne.reduce((s, a) => s + Math.log(a), 0) / ligne.length)));
}

// Ratio de cohérence CR = CI / RI, avec CI = (lambdaMax - n) / (n - 1). CR = 0 si n <= 2.
export function ratioCoherence(A) {
  const n = A.length;
  if (n <= 2) return 0;
  if (n > RI.length) throw new Error(`au plus ${RI.length} critères`);
  const { lambdaMax } = poidsVecteurPropre(A);
  return (lambdaMax - n) / (n - 1) / RI[n - 1];
}

// Agrège les matrices de plusieurs répondants par moyenne géométrique case par case.
export function agreger(matrices) {
  const n = matrices[0].length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => Math.exp(matrices.reduce((s, M) => s + Math.log(M[i][j]), 0) / matrices.length))
  );
}

// Poids d'une tâche : w_i = somme_k poids_k * note_ik (notes de 0 à 10).
export function scoresTaches(poidsCriteres, notes) {
  return notes.map((ligne) => ligne.reduce((s, note, k) => s + poidsCriteres[k] * note, 0));
}

// Échelle de Saaty, de 1/9 à 9, et sa position sur un curseur de -8 à 8 (0 = importance égale).
export const valeurDepuisCurseur = (c) => (c >= 0 ? c + 1 : 1 / (1 - c));
export const curseurDepuisValeur = (v) => (v >= 1 ? Math.round(v - 1) : -Math.round(1 / v - 1));
