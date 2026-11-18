// Montants du site : en francs CFA (FCFA), avec l'équivalent en euros en petit (consigne de l'équipe, 18/11/2026).
// Parité fixe du franc CFA d'Afrique centrale : 1 € = 655,957 FCFA.
export const PARITE_EUR_FCFA = 655.957;

// Montant en centimes d'euro prélevé par Stripe pour un montant en FCFA (Stripe ne prélève pas de FCFA).
export const centimesEuro = (fcfa) => Math.round((fcfa * 100) / PARITE_EUR_FCFA);

// « 50 000 FCFA » (séparateur des milliers de la langue choisie).
export const formatFcfa = (lang, fcfa) => `${new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(fcfa)} FCFA`;

// « ≈ 76 € » : équivalent arrondi à l'euro, pour l'affichage seulement.
export const formatEuroArrondi = (lang, fcfa) =>
  `≈ ${new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(fcfa / PARITE_EUR_FCFA))}`;

// « 76,22 € » : montant exact prélevé, montré dans le récapitulatif avant le paiement.
export const formatEuroExact = (lang, fcfa) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(centimesEuro(fcfa) / 100);
