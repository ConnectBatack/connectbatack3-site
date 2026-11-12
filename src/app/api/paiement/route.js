import { NextResponse } from "next/server";
import { clientStripe } from "@/lib/stripe";
import { nettoyerDon, verifierDon } from "@/lib/regles-don";
import { adresseSite, lireObjetJson, origineAutorisee } from "@/lib/requete";

// Crée une session Stripe Checkout et renvoie son adresse.
// Les données de carte sont saisies chez Stripe, jamais sur ce site.
// À FAIRE avant les dons réels : limite de requêtes (voir le journal des décisions).
export async function POST(request) {
  if (!origineAutorisee(request)) return NextResponse.json({ erreur: "origine" }, { status: 403 });

  const recu = await lireObjetJson(request);
  if (!recu) return NextResponse.json({ erreur: "requete" }, { status: 400 });
  const erreurs = verifierDon(recu);
  if (erreurs.length > 0) {
    return NextResponse.json({ erreur: "validation", champs: erreurs }, { status: 400 });
  }
  const don = nettoyerDon(recu);

  let stripe;
  try {
    stripe = clientStripe();
  } catch {
    console.error("Paiement : configuration Stripe refusée (clé de production sans autorisation).");
    return NextResponse.json({ erreur: "configuration" }, { status: 503 });
  }
  if (!stripe) return NextResponse.json({ erreur: "nonConfigure" }, { status: 503 });

  const site = adresseSite(request);
  if (!site) {
    console.error("Paiement : NEXT_PUBLIC_SITE_URL manquante en production.");
    return NextResponse.json({ erreur: "configuration" }, { status: 503 });
  }

  const mensuel = don.frequence === "mensuel";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: mensuel ? "subscription" : "payment",
      allowed_payment_method_types: [don.moyen === "bancontact" ? "bancontact" : "card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: don.montant * 100,
            product_data: { name: mensuel ? "Don mensuel ConnectBatack 3" : "Don ConnectBatack 3" },
            ...(mensuel ? { recurring: { interval: "month" } } : {}),
          },
        },
      ],
      customer_email: don.email,
      // L'adresse postale n'est demandée que pour l'attestation fiscale.
      billing_address_collection: don.attestation ? "required" : "auto",
      locale: don.langue,
      // Pas de donnée personnelle dans les métadonnées : seulement ce qui sert au suivi du don.
      metadata: {
        projet: don.projet || "general",
        attestation: don.attestation ? "oui" : "non",
        langue: don.langue,
      },
      success_url: `${site}/${don.langue}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/${don.langue}/don?annule=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    // Jamais le message complet : Stripe y cite parfois la valeur refusée (par exemple l'e-mail).
    console.error("Stripe :", e?.type ?? "erreur", e?.code ?? "", e?.requestId ?? "");
    if (e?.param === "customer_email") return NextResponse.json({ erreur: "validation", champs: ["email"] }, { status: 400 });
    return NextResponse.json({ erreur: "serveur" }, { status: 502 });
  }
}
