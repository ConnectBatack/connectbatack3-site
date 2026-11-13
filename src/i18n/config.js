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

// Versions linguistiques d'une page, pour les balises hreflang (adresses complètes grâce à
// metadataBase, défini dans la mise en page racine). chemin : "" pour l'accueil, "/don", etc.
export function alternatesPage(lang, chemin) {
  return {
    canonical: `/${lang}${chemin}`,
    languages: {
      ...Object.fromEntries(langues.map((l) => [l, `/${l}${chemin}`])),
      "x-default": `/${langueParDefaut}${chemin}`,
    },
  };
}

export function estLangue(valeur) {
  return langues.includes(valeur);
}
