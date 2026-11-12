// DONNÉES D'EXEMPLE de l'espace de gestion (maquette). Rien ici ne vient du COVIDEBA :
// coûts, durées, poids et dons sont inventés pour montrer le fonctionnement.
// Elles seront remplacées par la base de données (backend de Pio).

// Instance au format commun des solveurs (Delegation_Argon4/format_entree_solveur/FORMAT.md).
export const instanceExemple = {
  nom: "exemple_maquette_dispensaire",
  h: 6,
  S0: 3200,
  Smin: 500,
  delta: 0.1,
  D: [900, 900, 900, 900, 900, 900],
  taches: [
    { id: 1, libelle: "Toiture du dispensaire", cout: 2500, duree: 2, poids: 9 },
    { id: 2, libelle: "Câblage électrique", cout: 1200, duree: 1, poids: 8 },
    { id: 3, libelle: "Matériel d'analyse", cout: 2000, duree: 1, poids: 7 },
    { id: 4, libelle: "Entretien des batteries", cout: 400, duree: 1, poids: 6 },
    { id: 5, libelle: "Salaire d'un instituteur (trimestre)", cout: 900, duree: 3, poids: 7 },
    { id: 6, libelle: "Citerne d'eau", cout: 1500, duree: 2, poids: 5 },
  ],
  precedences: [[1, 2], [2, 3]],
};

// Écritures du registre (partie double simplifiée pour l'affichage).
export const ecrituresExemple = [
  { numero: 7, date: "2026-11-08", libelle: "Don en ligne (Stripe)", compte: "Fonds chez l'institution agréée", entree: 50, sortie: 0, devise: "EUR", etat: "validee", hash: "9f2c…a41e" },
  { numero: 6, date: "2026-11-06", libelle: "Cotisation Mobile Money", compte: "Mobile Money", entree: 32800, sortie: 0, devise: "FCFA", etat: "a_contresigner", hash: "71bd…0c93" },
  { numero: 5, date: "2026-11-02", libelle: "Achat de câbles électriques", compte: "Caisse", entree: 0, sortie: 45000, devise: "FCFA", etat: "validee", hash: "c04a…5f12" },
  { numero: 4, date: "2026-10-28", libelle: "Reversement de l'institution agréée", compte: "Banque du COVIDEBA", entree: 1200, sortie: 0, devise: "EUR", etat: "validee", hash: "2e88…b7d0" },
  { numero: 3, date: "2026-10-20", libelle: "Correction de l'écriture 2 (montant)", compte: "Caisse", entree: 5000, sortie: 0, devise: "FCFA", etat: "validee", hash: "ab31…9e64" },
];

// Parité fixe du franc CFA : 1 € = 655,957 FCFA.
export const PARITE_FCFA = 655.957;
