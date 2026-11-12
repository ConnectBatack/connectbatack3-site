import { NextResponse } from "next/server";
import { langues, langueParDefaut } from "@/i18n/config";

// Choisit la langue : d'abord le choix mémorisé (cookie), puis celle du navigateur.
function choisirLangue(request) {
  const memorisee = request.cookies.get("langue")?.value;
  if (langues.includes(memorisee)) return memorisee;

  const entete = request.headers.get("accept-language") || "";
  for (const partie of entete.split(",")) {
    const code = partie.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (langues.includes(code)) return code;
  }
  return langueParDefaut;
}

// Ajoute la langue au début de l'adresse quand elle manque : /don devient /fr/don.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const aUneLangue = langues.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (aUneLangue) return;

  request.nextUrl.pathname = `/${choisirLangue(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Exclut les routes d'API, les fichiers internes de Next.js et les fichiers statiques.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
