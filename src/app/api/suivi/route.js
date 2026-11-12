import { NextResponse } from "next/server";
import { idsProjets } from "@/donnees/projets";
import { langues } from "@/i18n/config";

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Inscription au suivi d'un projet.
// PAS ENCORE ACTIVÉE : aucune adresse n'est enregistrée tant qu'il n'y a pas de base de données
// (backend de Pio). Il faudra alors stocker l'adresse avec la date du consentement, envoyer un
// e-mail de confirmation (double opt-in) et prévoir un lien de désinscription dans chaque e-mail.
export async function POST(request) {
  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: "requete" }, { status: 400 });
  }
  const valide =
    typeof corps.email === "string" && corps.email.length <= 254 && reEmail.test(corps.email) &&
    idsProjets.includes(corps.projet) && langues.includes(corps.langue) && corps.consentement === true;
  if (!valide) return NextResponse.json({ erreur: "validation" }, { status: 400 });

  return NextResponse.json({ erreur: "nonActive" }, { status: 503 });
}
