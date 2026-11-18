import { formatEuroArrondi, formatFcfa } from "@/lib/monnaie";

// Montant en FCFA suivi de son équivalent en euros, en petit.
export default function Montant({ fcfa, lang, gras = false }) {
  const principal = formatFcfa(lang, fcfa);
  return (
    <span className="montant">
      {gras ? <b>{principal}</b> : principal} <small className="montant-euro">({formatEuroArrondi(lang, fcfa)})</small>
    </span>
  );
}
