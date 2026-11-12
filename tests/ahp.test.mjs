// Tests de la méthode AHP. Valeurs de référence identiques à module_ahp/test_ahp.py.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matriceDepuisComparaisons, verifierMatrice, poidsVecteurPropre, poidsMoyenneGeometrique,
  ratioCoherence, agreger, scoresTaches, valeurDepuisCurseur, curseurDepuisValeur,
} from "../src/lib/ahp.js";

const A = [[1, 3, 5], [1 / 3, 1, 2], [1 / 5, 1 / 2, 1]];
const proche = (a, b, e) => Math.abs(a - b) <= e;

test("matrice de référence : poids (0,648 ; 0,230 ; 0,122), lambda max 3,004, CR 0,003", () => {
  const { poids, lambdaMax } = poidsVecteurPropre(A);
  [0.648, 0.23, 0.122].forEach((p, i) => assert.ok(proche(poids[i], p, 0.001), `poids ${i} : ${poids[i]}`));
  assert.ok(proche(lambdaMax, 3.004, 0.001), `lambda max : ${lambdaMax}`);
  assert.ok(proche(ratioCoherence(A), 0.003, 0.001), `CR : ${ratioCoherence(A)}`);
});

test("moyenne géométrique proche du vecteur propre", () => {
  const p = poidsMoyenneGeometrique(A);
  [0.648, 0.23, 0.122].forEach((v, i) => assert.ok(proche(p[i], v, 0.001)));
});

test("matrice incohérente (A > B, B > C, C > A) : CR > 0,1", () => {
  const M = [[1, 5, 1 / 5], [1 / 5, 1, 5], [5, 1 / 5, 1]];
  assert.ok(ratioCoherence(M) > 0.1);
});

test("la matrice construite depuis les comparaisons est réciproque", () => {
  const M = matriceDepuisComparaisons(3, { 0: { 1: 3, 2: 5 }, 1: { 2: 2 } });
  assert.deepEqual(verifierMatrice(M), []);
  assert.ok(proche(M[2][0], 1 / 5, 1e-12));
});

test("l'agrégation de deux matrices réciproques reste réciproque", () => {
  const M1 = [[1, 2, 3], [1 / 2, 1, 4], [1 / 3, 1 / 4, 1]];
  const M2 = [[1, 4, 1 / 2], [1 / 4, 1, 3], [2, 1 / 3, 1]];
  assert.deepEqual(verifierMatrice(agreger([M1, M2])), []);
});

test("matrice non réciproque refusée", () => {
  assert.ok(verifierMatrice([[1, 2], [2, 1]]).length > 0);
});

test("score des tâches : somme pondérée des notes", () => {
  assert.deepEqual(scoresTaches([0.7, 0.3], [[10, 0], [0, 10]]).map((x) => Math.round(x * 1e9) / 1e9), [7, 3]);
});

test("curseur de Saaty : aller-retour entre position et valeur", () => {
  for (let c = -8; c <= 8; c++) assert.equal(curseurDepuisValeur(valeurDepuisCurseur(c)), c);
  assert.equal(valeurDepuisCurseur(0), 1);
  assert.equal(valeurDepuisCurseur(8), 9);
  assert.ok(proche(valeurDepuisCurseur(-8), 1 / 9, 1e-12));
});
