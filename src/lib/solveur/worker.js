// Calcul du plan dans un Web Worker : la page reste utilisable pendant que HiGHS cherche.
import loadHighs from "highs";
import { resoudre } from "./modele.js";

let highs = null;

self.onmessage = async ({ data }) => {
  try {
    if (!highs) {
      highs = await loadHighs({ locateFile: (fichier) => new URL(`/solveur/${fichier}`, self.location.origin).href });
    }
    self.postMessage(resoudre(highs, data.instance, { limiteTempsS: data.limiteTempsS }));
  } catch (e) {
    self.postMessage({ statut: "erreur", erreurs: [String(e?.message ?? e)] });
  }
};
