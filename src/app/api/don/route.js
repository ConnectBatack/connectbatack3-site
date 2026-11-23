import { NextResponse } from "next/server";
import { TAILLE_MAX_RECU, TYPES_RECU_AUTORISES, nettoyerDon, verifierDon } from "@/lib/regles-don";
import { origineAutorisee } from "@/lib/requete";
import { DonsDPTsAvecReUService, reponseErreurLib2 } from "@/lib2/serveur";

// Reçoit le don et le reçu de dépôt (multipart/form-data), revérifie côté serveur Next.js,
// puis transmet au backend FastAPI exclusivement via src/lib2.
export async function POST(request) {
  if (!origineAutorisee(request)) {
    return NextResponse.json({ erreur: "origine" }, { status: 403 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ erreur: "requete" }, { status: 400 });
  }

  const brut = {
    montant: Number(form.get("montant_fcfa")),
    frequence: "ponctuel",
    moyen: String(form.get("moyen") ?? ""),
    projet: String(form.get("projet") ?? ""),
    prenom: String(form.get("prenom") ?? ""),
    nom: String(form.get("nom") ?? ""),
    email: String(form.get("email") ?? ""),
    telephone: String(form.get("telephone") ?? ""),
    pays: String(form.get("pays") ?? ""),
    attestation: form.get("attestation") === "true",
    conditions: form.get("conditions") === "true",
    referenceRecu: String(form.get("receipt_reference") ?? ""),
    langue: String(form.get("langue") ?? "fr"),
  };

  const erreurs = verifierDon(brut);
  if (erreurs.length > 0) {
    return NextResponse.json({ erreur: "validation", champs: erreurs }, { status: 400 });
  }

  const recu = form.get("receipt_file");
  if (!(recu instanceof File) || recu.size <= 0 || recu.size > TAILLE_MAX_RECU || !TYPES_RECU_AUTORISES.includes(recu.type)) {
    return NextResponse.json({ erreur: "validation", champs: ["receipt_file"] }, { status: 400 });
  }

  const don = nettoyerDon(brut);
  try {
    const data = await DonsDPTsAvecReUService.submitDonationReceiptApiV1DonationsSubmitReceiptPost({
      montant_fcfa: don.montant,
      moyen: don.moyen,
      receipt_reference: don.referenceRecu,
      nom: don.nom,
      prenom: don.prenom,
      email: don.email,
      telephone: don.telephone,
      pays: don.pays,
      attestation: don.attestation,
      conditions: true,
      langue: don.langue,
      projet: don.projet,
      receipt_file: recu,
    });
    return NextResponse.json({ ok: true, ...data }, { status: 201 });
  } catch (err) {
    return reponseErreurLib2(err);
  }
}
