import Link from "next/link";
import Image from "next/image";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";

const formatEuro = (lang, n) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Carte de projet : photo en fond, accroche courte en majuscules, avancement en bas.
export default function CarteProjet({ projet, dict, lang }) {
  const t = dict.projets[projet.id];
  const pourcent = Math.min(100, Math.round((projet.collecte / projet.objectif) * 100));
  return (
    <Apparition as="li">
      <Link className="carte" href={`/${lang}/projets/${projet.id}`}>
        <span className="carte-image">
          <Image src={cheminPhoto(projet.photo)} alt="" fill sizes="(max-width: 900px) 92vw, 25vw" />
        </span>
        <p className="carte-accroche">{t.accroche}</p>
        <span className="carte-bas">
          <span className="carte-categorie">{t.categorie}</span>
          <span className="carte-titre">{t.titre}</span>
          <span className="progression" role="progressbar" aria-label={t.titre} aria-valuenow={pourcent} aria-valuemin={0} aria-valuemax={100}>
            <span className="progression-barre" style={{ "--p": `${pourcent}%` }} />
          </span>
          <span className="carte-ligne">
            <span className="progression-texte">
              <b>{formatEuro(lang, projet.collecte)}</b> {dict.accueil.collecte} {formatEuro(lang, projet.objectif)}
            </span>
            <span aria-hidden="true">→</span>
          </span>
        </span>
      </Link>
    </Apparition>
  );
}
