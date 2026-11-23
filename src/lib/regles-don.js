// Règles du don, partagées par le formulaire (navigateur) et par la route serveur (/api/don).
// Le don se fait par dépôt ou virement sur le compte du COVIDEBA, puis soumission du reçu.
import { idsProjets } from "@/donnees/projets";
import { langues } from "@/i18n/config";

export const DON_MENSUEL_ACTIF = false;
export const frequences = ["ponctuel"];

// Montants en FCFA (minimum : 5 000 FCFA).
export const MONTANT_MIN = 5000;
export const MONTANT_MAX = 655000000;

export const montantsProposes = {
  ponctuel: [10000, 25000, 50000, 100000],
  mensuel: [5000, 10000, 25000, 50000],
};

export const moyensDepot = ["virement", "depot_bancaire", "mobile_money"];
export const paysResidence = ["BE", "autre"];
export const TAILLE_MAX_RECU = 10 * 1024 * 1024; // 10 Mo
export const TYPES_RECU_AUTORISES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const estTexte = (v, max) => typeof v === "string" && v.length <= max;

export function verifierDon(don) {
  if (!don || typeof don !== "object" || Array.isArray(don)) return ["requete"];
  const erreurs = [];
  const m = don.montant;
  if (typeof m !== "number" || !Number.isInteger(m) || m < MONTANT_MIN || m > MONTANT_MAX) erreurs.push("montant");
  if (!frequences.includes(don.frequence ?? "ponctuel")) erreurs.push("frequence");
  if (!moyensDepot.includes(don.moyen)) erreurs.push("moyen");
  if (don.projet !== undefined && don.projet !== "" && !idsProjets.includes(don.projet)) erreurs.push("projet");
  if (!estTexte(don.nom, 100) || don.nom.trim().length < 1) erreurs.push("nom");
  if (don.prenom !== undefined && !estTexte(don.prenom, 100)) erreurs.push("prenom");

  const email = (don.email ?? "").trim();
  const tel = (don.telephone ?? "").trim();
  if (email !== "" && (!estTexte(email, 254) || !reEmail.test(email))) erreurs.push("email");
  if (tel !== "" && !estTexte(tel, 32)) erreurs.push("telephone");
  if (email === "" && tel === "") erreurs.push("email");

  if (!paysResidence.includes(don.pays)) erreurs.push("pays");
  if (don.attestation !== undefined && typeof don.attestation !== "boolean") erreurs.push("attestation");
  if (don.attestation === true && don.pays !== "BE") erreurs.push("attestation");
  if (!estTexte(don.referenceRecu, 120) || don.referenceRecu.trim().length < 2) erreurs.push("referenceRecu");
  if (don.conditions !== true) erreurs.push("conditions");
  if (!langues.includes(don.langue)) erreurs.push("langue");
  return erreurs;
}

export function nettoyerDon(don) {
  return {
    montant: don.montant,
    frequence: "ponctuel",
    moyen: don.moyen,
    projet: don.projet || "",
    prenom: (don.prenom ?? "").trim(),
    nom: don.nom.trim(),
    email: (don.email ?? "").trim(),
    telephone: (don.telephone ?? "").trim(),
    pays: don.pays,
    attestation: don.attestation === true && don.pays === "BE",
    referenceRecu: don.referenceRecu.trim(),
    langue: don.langue,
  };
}
