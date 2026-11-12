import "server-only";
import Stripe from "stripe";

// Renvoie un client Stripe, ou null si la clé n'est pas configurée (préversion).
// Refuse une clé de production tant que le compte de l'institution agréée n'est pas validé.
export function clientStripe() {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) return null;
  if (!cle.startsWith("sk_test_") && process.env.PAIEMENT_REEL_AUTORISE !== "oui") {
    throw new Error("Clé Stripe de production refusée : mode test uniquement pour l'instant.");
  }
  return new Stripe(cle);
}
