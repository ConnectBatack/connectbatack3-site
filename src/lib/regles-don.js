// Règles du don, partagées par le formulaire (navigateur) et par la route de paiement (serveur).
// Le serveur refait toujours la vérification : on ne fait jamais confiance au navigateur.
import { idsProjets } from "@/donnees/projets";
import { langues } from "@/i18n/config";

export const MONTANT_MIN = 5;
export const MONTANT_MAX = 5000;

// Montants proposés. Les phrases associées sont dans les dictionnaires (don.contextes).
export const montantsProposes = {
  ponctuel: [25, 50, 100, 250],
  mensuel: [10, 20, 35, 50],
};

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const estTexte = (v, max) => typeof v === "string" && v.length <= max;

// Renvoie la liste des erreurs (codes) ; une liste vide veut dire que le don est valide.
// Les types sont stricts : un montant doit être un nombre, pas un texte ni une liste.
export function verifierDon(don) {
  if (!don || typeof don !== "object" || Array.isArray(don)) return ["requete"];
  const erreurs = [];
  const m = don.montant;
  if (typeof m !== "number" || !Number.isInteger(m) || m < MONTANT_MIN || m > MONTANT_MAX) erreurs.push("montant");
  if (!["ponctuel", "mensuel"].includes(don.frequence)) erreurs.push("frequence");
  if (!["bancontact", "carte"].includes(don.moyen)) erreurs.push("moyen");
  if (don.frequence === "mensuel" && don.moyen !== "carte") erreurs.push("moyen");
  if (don.projet !== undefined && don.projet !== "" && !idsProjets.includes(don.projet)) erreurs.push("projet");
  if (!estTexte(don.nom, 100) || don.nom.trim().length < 1) erreurs.push("nom");
  if (don.prenom !== undefined && !estTexte(don.prenom, 100)) erreurs.push("prenom");
  if (!estTexte(don.email, 254) || !reEmail.test(don.email)) erreurs.push("email");
  if (don.attestation !== undefined && typeof don.attestation !== "boolean") erreurs.push("attestation");
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
    attestation: don.attestation === true,
    langue: don.langue,
  };
}
