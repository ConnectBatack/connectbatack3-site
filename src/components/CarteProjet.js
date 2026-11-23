import Link from "next/link";
import Image from "next/image";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";
import Montant from "@/components/Montant";


// Carte de projet : photo en fond, accroche courte en majuscules, avancement en bas.
export default function CarteProjet({ projet, dict, lang }) {
  const fallback = dict.projets[projet.id] || {};
  const t = {
    categorie: projet.textes?.category?.[lang] || projet.textes?.category?.fr || fallback.categorie || "",
    titre: projet.textes?.title?.[lang] || projet.textes?.title?.fr || fallback.titre || projet.id,
    accroche: projet.textes?.tagline?.[lang] || projet.textes?.tagline?.fr || fallback.accroche || "",
  };
  const src = projet.photoSrc || cheminPhoto(projet.photo);
  const pourcent = projet.objectif > 0 ? Math.min(100, Math.round((projet.collecte / projet.objectif) * 100)) : 0;
  return (
    <Apparition as="li">
      <Link className="carte" href={`/${lang}/projets/${projet.id}`}>
        <span className="carte-image">
          <Image src={src} alt="" fill sizes="(max-width: 900px) 92vw, 25vw" unoptimized={src.startsWith("/api/")} />
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
              <Montant fcfa={projet.collecte} lang={lang} gras /> {dict.accueil.collecte} <Montant fcfa={projet.objectif} lang={lang} />
            </span>
            <span aria-hidden="true">→</span>
          </span>
        </span>
      </Link>
    </Apparition>
  );
}
