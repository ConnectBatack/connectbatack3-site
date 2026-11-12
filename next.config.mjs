// En-têtes de sécurité appliqués à toutes les réponses.
// La CSP autorise les scripts en ligne, nécessaires au rendu statique de Next.js.
// Passer à une CSP avec nonce demandera un rendu dynamique (voir README, section Sécurité).
const estDev = process.env.NODE_ENV === "development";

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
