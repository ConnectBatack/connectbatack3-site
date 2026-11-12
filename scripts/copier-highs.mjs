// Copie le solveur HiGHS (WebAssembly) dans public/ pour que le navigateur puisse le charger.
// Lancé automatiquement avant `npm run dev` et `npm run build` : la version suit toujours celle du paquet.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const source = join(dirname(require.resolve("highs")), "highs.wasm");
const cible = join(process.cwd(), "public", "solveur", "highs.wasm");
mkdirSync(dirname(cible), { recursive: true });
copyFileSync(source, cible);
console.log(`HiGHS copié dans ${cible}`);
