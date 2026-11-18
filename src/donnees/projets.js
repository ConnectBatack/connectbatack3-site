// Projets affichés sur la vitrine. Les textes sont dans les dictionnaires (clé « projets »).
// DONNÉES D'EXEMPLE, en FCFA (consigne de l'équipe, 18/11/2026) : les montants seront remplacés par ceux du COVIDEBA,
// puis lus depuis la base de données quand elle existera.
// photo : nom d'un fichier de public/images (sans extension). Le texte alternatif est dans les dictionnaires (clé « photos »).
export const projets = [
// contributeurs : nombre de personnes ayant donné à ce projet (exemple ; viendra du registre des dons).
  { id: "dispensaire", photo: "dispensaire-facade", collecte: 2750000, objectif: 8000000, contributeurs: 37 },
  { id: "batteries", photo: "panneau-solaire", collecte: 600000, objectif: 2000000, contributeurs: 12 },
  { id: "ecole", photo: "salle-de-classe", collecte: 425000, objectif: 800000, contributeurs: 9 },
  // Pas encore de photo du réseau d'eau : paysage du village en attendant.
  { id: "eau", photo: "batack-paysage", collecte: 200000, objectif: 3300000, contributeurs: 4 },
  { id: "marche", photo: "marche", collecte: 0, objectif: 2600000, contributeurs: 0 },
    // Objectif d'exemple : à remplacer par le coût réel annoncé par le COVIDEBA.
  { id: "route", photo: "batack-paysage", collecte: 0, objectif: 5250000, contributeurs: 0 },
];

export const idsProjets = projets.map((p) => p.id);

export const cheminPhoto = (nom) => `/images/${nom}.jpg`;
