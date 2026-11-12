import { NextResponse } from "next/server";
import { clientStripe } from "@/lib/stripe";

// Reçoit les notifications de Stripe. La signature est vérifiée avant toute action :
// sans elle, n'importe qui pourrait annoncer un faux paiement.
export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = secret ? clientStripe() : null;
  if (!stripe) {
    return NextResponse.json({ erreur: "nonConfigure" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const corps = await request.text();

  let evenement;
  try {
    evenement = stripe.webhooks.constructEvent(corps, signature, secret);
  } catch {
    return NextResponse.json({ erreur: "signature" }, { status: 400 });
  }

  switch (evenement.type) {
    case "checkout.session.completed":
    case "invoice.paid":
      // À faire quand la base existera : passer le Don à PAYÉ et créer l'écriture
      // « fonds chez l'institution agréée » (voir diagrammes UML v2, figure 6).
      console.log("Paiement confirmé :", evenement.type, evenement.data.object.id);
      break;
    default:
      break;
  }
  return NextResponse.json({ recu: true });
}
