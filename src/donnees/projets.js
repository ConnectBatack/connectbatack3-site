// Projets affichés sur la vitrine. Les textes sont dans les dictionnaires (clé « projets »).
// DONNÉES D'EXEMPLE : les montants seront remplacés par ceux du COVIDEBA,
// puis lus depuis la base de données quand elle existera.
// photo : nom d'un fichier de public/images (sans extension). Le texte alternatif est dans les dictionnaires (clé « photos »).
export const projets = [
// contributeurs : nombre de personnes ayant donné à ce projet (exemple ; viendra du registre des dons).
  { id: "dispensaire", photo: "dispensaire-facade", collecte: 4200, objectif: 12000, contributeurs: 37 },
  { id: "batteries", photo: "panneau-solaire", collecte: 900, objectif: 3000, contributeurs: 12 },
  { id: "ecole", photo: "salle-de-classe", collecte: 650, objectif: 1200, contributeurs: 9 },
  // Pas encore de photo du réseau d'eau : paysage du village en attendant.
  { id: "eau", photo: "batack-paysage", collecte: 300, objectif: 5000, contributeurs: 4 },
];

export const idsProjets = projets.map((p) => p.id);

export const cheminPhoto = (nom) => `/images/${nom}.jpg`;
