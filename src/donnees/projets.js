// Projets affichés sur la vitrine. Les textes sont dans les dictionnaires (clé « projets »).
// DONNÉES D'EXEMPLE : les montants seront remplacés par ceux du COVIDEBA,
// puis lus depuis la base de données quand elle existera.
export const projets = [
  { id: "dispensaire", couleur: "rouge", collecte: 4200, objectif: 12000 },
  { id: "batteries", couleur: "or", collecte: 900, objectif: 3000 },
  { id: "ecole", couleur: "turquoise", collecte: 650, objectif: 1200 },
  { id: "eau", couleur: "bleu", collecte: 300, objectif: 5000 },
];

export const idsProjets = projets.map((p) => p.id);
