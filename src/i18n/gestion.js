import "server-only";

// L'espace de gestion existe en français et en anglais (décision du 12/11/2026).
// Depuis les pages espagnoles et néerlandaises, il s'affiche en anglais.
export const languesGestion = ["fr", "en"];

export function langueGestion(lang) {
  return lang === "fr" ? "fr" : "en";
}

export async function chargerGestion(lang) {
  const l = langueGestion(lang);
  return l === "fr"
    ? (await import("./gestion/fr.json")).default
    : (await import("./gestion/en.json")).default;
}
