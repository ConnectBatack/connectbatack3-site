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

// Renvoie la liste des erreurs (codes) ; une liste vide veut dire que le don est valide.
export function verifierDon(don) {
  const erreurs = [];
  const montant = Number(don.montant);
  if (!Number.isInteger(montant) || montant < MONTANT_MIN || montant > MONTANT_MAX) {
    erreurs.push("montant");
  }
  if (!["ponctuel", "mensuel"].includes(don.frequence)) erreurs.push("frequence");
  if (!["bancontact", "carte"].includes(don.moyen)) erreurs.push("moyen");
  if (don.frequence === "mensuel" && don.moyen !== "carte") erreurs.push("moyen");
  if (don.projet && !idsProjets.includes(don.projet)) erreurs.push("projet");
  if (typeof don.nom !== "string" || don.nom.trim().length < 1 || don.nom.length > 100) {
    erreurs.push("nom");
  }
  if (typeof don.prenom === "string" && don.prenom.length > 100) erreurs.push("prenom");
  if (typeof don.email !== "string" || don.email.length > 254 || !reEmail.test(don.email)) {
    erreurs.push("email");
  }
  if (don.conditions !== true) erreurs.push("conditions");
  if (!langues.includes(don.langue)) erreurs.push("langue");
  return erreurs;
}
