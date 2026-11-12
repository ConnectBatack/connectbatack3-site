import "server-only";

// Adresse publique du site. En production, elle doit venir de la configuration
// (NEXT_PUBLIC_SITE_URL) : on ne construit jamais une adresse de retour à partir de la requête.
export function adresseSite(request) {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuree) return configuree.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return null;
  return request.nextUrl.origin;
}

// Refuse une requête envoyée depuis un autre site (en-tête Origin différent du nôtre).
// Une requête sans en-tête Origin (outil en ligne de commande) est laissée aux autres contrôles.
export function origineAutorisee(request) {
  const origine = request.headers.get("origin");
  if (!origine) return true;
  const site = adresseSite(request) ?? request.nextUrl.origin;
  return origine === site || origine === request.nextUrl.origin;
}

// Lit un corps JSON qui doit être un objet. Renvoie null sinon (texte invalide, null, liste…).
export async function lireObjetJson(request) {
  try {
    const corps = await request.json();
    return corps && typeof corps === "object" && !Array.isArray(corps) ? corps : null;
  } catch {
    return null;
  }
}
