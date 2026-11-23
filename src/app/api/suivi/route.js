import { NextResponse } from "next/server";
import { langues } from "@/i18n/config";
import { SuiviDesProjetsRgpdService, lireCorpsMutation, reponseErreurLib2 } from "@/lib2/serveur";

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reSlug = /^[a-z0-9-]{2,64}$/;

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;

  const email = typeof corps.email === "string" ? corps.email.trim() : "";
  const projet = typeof corps.projet === "string" ? corps.projet.trim() : "";
  const langue = typeof corps.langue === "string" ? corps.langue.trim() : "";
  const valide =
    email.length <= 254 &&
    reEmail.test(email) &&
    reSlug.test(projet) &&
    langues.includes(langue) &&
    corps.consentement === true;

  if (!valide) {
    return NextResponse.json({ erreur: "validation" }, { status: 400 });
  }

  try {
    const data = await SuiviDesProjetsRgpdService.followProjectApiV1SubscriptionsFollowPost({
      email,
      project_slug: projet,
      language: langue,
      consent_given: true,
    });
    return NextResponse.json({ ok: true, ...data }, { status: 201 });
  } catch (err) {
    return reponseErreurLib2(err);
  }
}
