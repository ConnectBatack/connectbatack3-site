// En-têtes de sécurité appliqués à toutes les réponses.
// La CSP autorise les scripts en ligne, nécessaires au rendu statique de Next.js.
// Passer à une CSP avec nonce demandera un rendu dynamique (voir README, section Sécurité).
import { readFileSync } from "node:fs";

const estDev = process.env.NODE_ENV === "development";
// Version du solveur HiGHS, transmise au navigateur pour charger highs-<version>.wasm.
const versionHighs = JSON.parse(readFileSync(new URL("./node_modules/highs/package.json", import.meta.url), "utf8")).version;

const csp = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' autorise seulement la compilation de WebAssembly (solveur HiGHS), pas eval().
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${estDev ? " 'unsafe-eval'" : ""}`,
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_HIGHS_VERSION: versionHighs },
  images: { formats: ["image/avif", "image/webp"], qualities: [75] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      {
        // Le nom du fichier change avec la version : cache d'un an sans risque.
        source: "/solveur/:fichier*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
