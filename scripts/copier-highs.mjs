// Copie le solveur HiGHS (WebAssembly) dans public/ pour que le navigateur puisse le charger.
// Le nom du fichier contient la version (highs-1.15.4.wasm) : le navigateur peut le garder en cache
// un an sans risque, car une nouvelle version aura un nouveau nom.
// Lancé automatiquement par `npm run dev` et `npm run build`.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dossierHighs = dirname(require.resolve("highs"));
const { version } = JSON.parse(readFileSync(join(dossierHighs, "..", "package.json"), "utf8"));
const cibleDossier = join(process.cwd(), "public", "solveur");
mkdirSync(cibleDossier, { recursive: true });
for (const f of readdirSync(cibleDossier)) rmSync(join(cibleDossier, f)); // anciennes versions
const cible = join(cibleDossier, `highs-${version}.wasm`);
copyFileSync(join(dossierHighs, "highs.wasm"), cible);
console.log(`HiGHS ${version} copié dans ${cible}`);
