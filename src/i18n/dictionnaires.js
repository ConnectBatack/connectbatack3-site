import "server-only";
import { notFound } from "next/navigation";
import { estLangue, langues } from "./config";

const dictionnaires = {
  fr: () => import("./fr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
  nl: () => import("./nl.json").then((m) => m.default),
};

export async function chargerDictionnaire(langue) {
  if (!estLangue(langue)) notFound();
  return dictionnaires[langue]();
}

// Textes de la fenêtre de changement de langue, dans les quatre langues.
// Le sélecteur en a besoin pour afficher le message dans la langue choisie.
export async function chargerTextesChangementLangue() {
  const resultat = {};
  for (const l of langues) {
    resultat[l] = (await dictionnaires[l]()).changementLangue;
  }
  return resultat;
}
