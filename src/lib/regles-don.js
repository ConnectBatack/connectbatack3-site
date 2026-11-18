// Règles du don, partagées par le formulaire (navigateur) et par la route de paiement (serveur).
// Le serveur refait toujours la vérification : on ne fait jamais confiance au navigateur.
import { idsProjets } from "@/donnees/projets";
import { langues } from "@/i18n/config";

// Don mensuel masqué (décision de Roy, 13/11/2026) : à réactiver quand l'arrêt du don
// (portail client Stripe) et le suivi des paiements échoués seront prêts. Les textes qui
// parlaient du don mensuel ont été raccourcis dans le commit qui a ajouté cette ligne.
export const DON_MENSUEL_ACTIF = false;
export const frequences = DON_MENSUEL_ACTIF ? ["ponctuel", "mensuel"] : ["ponctuel"];

// Montants en FCFA (consigne de l'équipe, 18/11/2026). Stripe prélève l'équivalent exact en euros
// (voir src/lib/monnaie.js). Minimum : 5 000 FCFA (environ 8 €).
// Pas de maximum pour le donateur (décision de Roy, 18/11/2026). MONTANT_MAX est seulement la limite
// technique de Stripe (999 999,99 € par paiement), jamais affichée.
export const MONTANT_MIN = 5000;
export const MONTANT_MAX = 655000000;

// Montants proposés, en FCFA. Les phrases associées sont dans les dictionnaires (don.contextes).
export const montantsProposes = {
  ponctuel: [10000, 25000, 50000, 100000],
  mensuel: [5000, 10000, 25000, 50000],
};

// Pays de résidence : l'attestation fiscale est réservée aux donateurs résidant en Belgique (consigne de l'équipe, 18/11/2026).
export const paysResidence = ["BE", "autre"];

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const estTexte = (v, max) => typeof v === "string" && v.length <= max;

// Renvoie la liste des erreurs (codes) ; une liste vide veut dire que le don est valide.
// Les types sont stricts : un montant doit être un nombre, pas un texte ni une liste.
export function verifierDon(don) {
  if (!don || typeof don !== "object" || Array.isArray(don)) return ["requete"];
  const erreurs = [];
  const m = don.montant;
  if (typeof m !== "number" || !Number.isInteger(m) || m < MONTANT_MIN || m > MONTANT_MAX) erreurs.push("montant");
  if (!frequences.includes(don.frequence)) erreurs.push("frequence");
  if (!["bancontact", "carte"].includes(don.moyen)) erreurs.push("moyen");
  if (don.frequence === "mensuel" && don.moyen !== "carte") erreurs.push("moyen");
  if (don.projet !== undefined && don.projet !== "" && !idsProjets.includes(don.projet)) erreurs.push("projet");
  if (!estTexte(don.nom, 100) || don.nom.trim().length < 1) erreurs.push("nom");
  if (don.prenom !== undefined && !estTexte(don.prenom, 100)) erreurs.push("prenom");
  if (!estTexte(don.email, 254) || !reEmail.test(don.email)) erreurs.push("email");
  if (!paysResidence.includes(don.pays)) erreurs.push("pays");
  if (don.attestation !== undefined && typeof don.attestation !== "boolean") erreurs.push("attestation");
  if (don.attestation === true && don.pays !== "BE") erreurs.push("attestation");
  if (don.conditions !== true) erreurs.push("conditions");
  if (!langues.includes(don.langue)) erreurs.push("langue");
  return erreurs;
}

// Copie propre d'un don déjà vérifié : seuls les champs attendus, avec leur type attendu.
export function nettoyerDon(don) {
  return {
    montant: don.montant,
    frequence: don.frequence,
    moyen: don.moyen,
    projet: don.projet || "",
    prenom: (don.prenom ?? "").trim(),
    nom: don.nom.trim(),
    email: don.email.trim(),
    pays: don.pays,
    attestation: don.attestation === true && don.pays === "BE",
    langue: don.langue,
  };
}
