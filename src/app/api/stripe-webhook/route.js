import { NextResponse } from "next/server";
import { clientStripe } from "@/lib/stripe";

// Reçoit les notifications de Stripe. La signature est vérifiée avant toute action :
// sans elle, n'importe qui pourrait annoncer un faux paiement.
export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let stripe = null;
  try {
    stripe = secret ? clientStripe() : null;
  } catch {
    // Clé de production sans autorisation : on répond 503 (Stripe réessaiera plus tard), jamais 500.
    return NextResponse.json({ erreur: "configuration" }, { status: 503 });
  }
  if (!stripe) return NextResponse.json({ erreur: "nonConfigure" }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  const corps = await request.text();

  let evenement;
  try {
    evenement = stripe.webhooks.constructEvent(corps, signature, secret);
  } catch {
    return NextResponse.json({ erreur: "signature" }, { status: 400 });
  }

  // À faire quand la base existera (voir diagrammes UML v2, figure 6) :
  //  - enregistrer evenement.id et ignorer une notification déjà reçue (Stripe peut l'envoyer deux fois) ;
  //  - ne passer le Don à PAYÉ que si l'argent est réellement reçu (payment_status === "paid"),
  //    puis créer l'écriture « fonds chez l'institution agréée » ;
  //  - dons mensuels : traiter aussi invoice.payment_failed et customer.subscription.deleted.
  switch (evenement.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = evenement.data.object;
      if (session.payment_status === "paid") console.log("Paiement confirmé :", evenement.type, session.id);
      break;
    }
    case "invoice.paid":
      console.log("Échéance mensuelle payée :", evenement.data.object.id);
      break;
    default:
      break;
  }
  return NextResponse.json({ recu: true });
}
