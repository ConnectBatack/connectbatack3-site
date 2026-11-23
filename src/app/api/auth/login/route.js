import { NextResponse } from "next/server";
import {
  AuthentificationService,
  appliquerCookiesSession,
  lireCorpsMutation,
  reponseErreurLib2,
} from "@/lib2/serveur";

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;

  const email = typeof corps.email === "string" ? corps.email.trim() : "";
  const password = typeof corps.password === "string" ? corps.password : "";
  const totpCode = typeof corps.totp_code === "string" ? corps.totp_code.trim() : "";

  if (!email || !password) {
    return NextResponse.json({ detail: "E-mail et mot de passe requis." }, { status: 400 });
  }

  try {
    const tokens = await AuthentificationService.loginApiV1AuthLoginPost({
      email,
      password,
      ...(totpCode ? { totp_code: totpCode } : {}),
    });
    const response = NextResponse.json({ ok: true, user: tokens.user }, { status: 200 });
    appliquerCookiesSession(response, request, tokens);
    return response;
  } catch (err) {
    return reponseErreurLib2(err);
  }
}
