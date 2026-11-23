import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { projets, cheminPhoto } from "@/donnees/projets";
import { chargerProjetSite } from "@/lib2/serveur";
import { langues, alternatesPage } from "@/i18n/config";
import Apparition from "@/components/Apparition";
import Compteur from "@/components/Compteur";
import Montant from "@/components/Montant";
import BoutonPartage from "@/components/BoutonPartage";
import FormulaireSuivi from "@/components/FormulaireSuivi";

export async function generateStaticParams() {
  return langues.flatMap((lang) => projets.map((p) => ({ lang, id: p.id })));
}

function textesProjet(projet, dict, lang) {
  const fallback = dict.projets[projet?.id] || {};
  return {
    categorie: projet?.textes?.category?.[lang] || projet?.textes?.category?.fr || fallback.categorie || "",
    titre: projet?.textes?.title?.[lang] || projet?.textes?.title?.fr || fallback.titre || projet?.id || "",
    accroche: projet?.textes?.tagline?.[lang] || projet?.textes?.tagline?.fr || fallback.accroche || "",
    description: projet?.textes?.description?.[lang] || projet?.textes?.description?.fr || fallback.description || "",
  };
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const [dict, projet] = await Promise.all([chargerDictionnaire(lang), chargerProjetSite(id)]);
  if (!projet && !dict.projets[id]) return {};
  const t = textesProjet(projet || { id }, dict, lang);
  return { title: `${t.titre} | COVIDEBA`, description: t.description, alternates: alternatesPage(lang, `/projets/${id}`) };
}

export default async function PageProjet({ params }) {
  const { lang, id } = await params;
  const [dict, projet] = await Promise.all([chargerDictionnaire(lang), chargerProjetSite(id)]);
  if (!projet) notFound();

  const t = textesProjet(projet, dict, lang);
  const a = dict.accueil;
  const src = projet.photoSrc || cheminPhoto(projet.photo);
  const pourcent = projet.objectif > 0 ? Math.min(100, Math.round((projet.collecte / projet.objectif) * 100)) : 0;

  return (
    <>
      <section className="bandeau-photo bandeau-photo-court">
        <div className="diapo active">
          <Image
            src={src}
            alt={dict.photos[projet.photo] || t.titre}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            unoptimized={src.startsWith("/api/")}
          />
        </div>
        <div className="bandeau-contenu">
          <div>
            <span className="surtitre">{t.categorie}</span>
            <h1>{t.accroche}</h1>
          </div>
        </div>
      </section>

      <section className="section section-etroite">
        <Apparition>
          <h2>{t.titre}</h2>
          <p>{t.description}</p>
          <div className="progression" role="progressbar" aria-label={t.titre} aria-valuenow={pourcent} aria-valuemin={0} aria-valuemax={100}>
            <span className="progression-barre" style={{ "--p": `${pourcent}%` }} />
          </div>
          <p className="progression-texte">
            <strong><Montant fcfa={projet.collecte} lang={lang} /></strong> {a.collecte} <Montant fcfa={projet.objectif} lang={lang} />
          </p>
          <ul className="stats-projet">
            <li>
              <Compteur valeur={pourcent} langue={lang} pourcentage />
              <span>{dict.projet.atteint}</span>
            </li>
            <li>
              <Compteur valeur={projet.contributeurs} langue={lang} />
              <span>{dict.projet.contributeurs}</span>
            </li>
            <li>
              <Compteur valeur={Math.max(0, projet.objectif - projet.collecte)} langue={lang} devise />
              <span>{dict.projet.reste}</span>
            </li>
          </ul>
          <p className="note-exemple">{dict.noteExemple}</p>
          <div className="projet-actions">
            <Link className="bouton bouton-principal bouton-grand" href={`/${lang}/don?projet=${projet.id}`}>
              {a.soutenir}
            </Link>
            <BoutonPartage t={dict.partage} titre={t.titre} />
          </div>
        </Apparition>
        <FormulaireSuivi t={dict.suivi} projet={projet.id} langue={lang} lienConfidentialite={`/${lang}/informations/confidentialite`} />
      </section>
    </>
  );
}
