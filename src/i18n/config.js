// Langues du site, dans l'ordre d'affichage du sélecteur.
export const langues = ["fr", "en", "es", "nl"];
export const langueParDefaut = "fr";

// Nom de chaque langue écrit dans cette langue.
export const nomsLangues = {
  fr: "Français",
  en: "English",
  es: "Español",
  nl: "Nederlands",
};

export function estLangue(valeur) {
  return langues.includes(valeur);
}
