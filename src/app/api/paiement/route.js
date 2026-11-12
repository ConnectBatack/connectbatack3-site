import { NextResponse } from "next/server";
import { clientStripe } from "@/lib/stripe";
import { verifierDon } from "@/lib/regles-don";

// Crée une session Stripe Checkout et renvoie son adresse.
// Les données de carte sont saisies chez Stripe, jamais sur ce site.
export async function POST(request) {
  let don;
  try {
    don = await request.json();
  } catch {
    return NextResponse.json({ erreur: "requete" }, { status: 400 });
  }

  const erreurs = verifierDon(don);
  if (erreurs.length > 0) {
    return NextResponse.json({ erreur: "validation", champs: erreurs }, { status: 400 });
  }

  let stripe;
  try {
    stripe = clientStripe();
  } catch (e) {
    console.error(e.message);
    return NextResponse.json({ erreur: "configuration" }, { status: 503 });
  }
  if (!stripe) {
    return NextResponse.json({ erreur: "nonConfigure" }, { status: 503 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const mensuel = don.frequence === "mensuel";
  const montantCentimes = Number(don.montant) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: mensuel ? "subscription" : "payment",
      allowed_payment_method_types: [don.moyen === "bancontact" ? "bancontact" : "card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: montantCentimes,
            product_data: { name: mensuel ? "Don mensuel ConnectBatack 3" : "Don ConnectBatack 3" },
            ...(mensuel ? { recurring: { interval: "month" } } : {}),
          },
        },
      ],
      customer_email: don.email,
      // L'adresse postale n'est demandée que pour l'attestation fiscale.
      billing_address_collection: don.attestation === true ? "required" : "auto",
      locale: don.langue,
      // Pas de donnée personnelle dans les métadonnées : seulement ce qui sert au suivi du don.
      metadata: {
        projet: don.projet || "general",
        attestation: don.attestation === true ? "oui" : "non",
        langue: don.langue,
      },
      success_url: `${site}/${don.langue}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/${don.langue}/don?annule=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe :", e.type || "erreur", e.message);
    return NextResponse.json({ erreur: "serveur" }, { status: 502 });
  }
}
