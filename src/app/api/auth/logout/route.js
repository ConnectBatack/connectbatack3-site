import { NextResponse } from "next/server";
import { AuthentificationService, effacerCookiesSession } from "@/lib2/serveur";
import { origineAutorisee } from "@/lib/requete";

export async function POST(request) {
  if (!origineAutorisee(request)) {
    return NextResponse.json({ detail: "Origine non autorisée." }, { status: 403 });
  }
  try {
    await AuthentificationService.logoutApiV1AuthLogoutPost();
  } catch {
    // On supprime tout de même les cookies locaux si la session est déjà expirée/injoignable.
  }
  const response = NextResponse.json({ ok: true });
  effacerCookiesSession(response);
  return response;
}
