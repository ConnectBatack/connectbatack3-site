import Link from "next/link";
import Image from "next/image";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { alternatesPage } from "@/i18n/config";
import { cheminPhoto } from "@/donnees/projets";
import { chargerProjetsSite } from "@/lib2/serveur";
import { montantsProposes } from "@/lib/regles-don";
import Montant from "@/components/Montant";
import Apparition from "@/components/Apparition";
import Diaporama from "@/components/Diaporama";
import Parallaxe from "@/components/Parallaxe";
import CarteProjet from "@/components/CarteProjet";


// Photos du diaporama d'accueil, dans l'ordre d'affichage.
const photosAccueil = ["batack-paysage", "accueil-chants", "installation-electrique", "ecole-publique", "marche"];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { alternates: alternatesPage(lang, "") };
}

export default async function Accueil({ params }) {
  const { lang } = await params;
  const [dict, listeProjets] = await Promise.all([chargerDictionnaire(lang), chargerProjetsSite()]);
  const a = dict.accueil;
  const besoinProjet = listeProjets.find((p) => p.isFeaturedNeed) || listeProjets[0];
  const besoinTitre = besoinProjet?.textes?.title?.[lang] || besoinProjet?.textes?.title?.fr || a.besoinTitre;
  const besoinDescription =
    besoinProjet?.textes?.tagline?.[lang] || besoinProjet?.textes?.tagline?.fr || a.besoinTexte;
  const besoinCollecte = besoinProjet ? besoinProjet.collecte : 920000;
  const besoinObjectif = besoinProjet && besoinProjet.objectif > 0 ? besoinProjet.objectif : 2625000;
  const besoinPourcent = Math.min(100, Math.round((besoinCollecte / besoinObjectif) * 100));

  return (
    <>
      <section className="bandeau-photo">
        <Diaporama
          t={{ libelle: dict.nav.diapos }}
          photos={photosAccueil.map((p) => ({ src: cheminPhoto(p), alt: dict.photos[p] }))}
        />
        <div className="bandeau-contenu">
          <div>
            <span className="surtitre">{a.surtitre}</span>
            <h1>{a.titre}</h1>
            <p>{a.intro}</p>
            <div className="hero-actions">
              <Link className="bouton bouton-or bouton-grand" href={`/${lang}/don`}>
                {a.boutonDon}
              </Link>
              <Link className="bouton bouton-contour bouton-grand" href={`/${lang}#projets`}>
                {a.boutonProjets}
              </Link>
            </div>
          </div>
          <Apparition className="besoin">
            <span className="surtitre">{a.prochainBesoin}</span>
            <h2>{besoinTitre}</h2>
            <p>{besoinDescription}</p>
            <div className="progression" role="progressbar" aria-label={besoinTitre} aria-valuenow={besoinPourcent} aria-valuemin={0} aria-valuemax={100}>
              <span className="progression-barre" style={{ "--p": `${besoinPourcent}%` }} />
            </div>
            <p className="progression-texte">
              <strong><Montant fcfa={besoinCollecte} lang={lang} /></strong> {a.collecte} <Montant fcfa={besoinObjectif} lang={lang} />
            </p>
            <p className="note-exemple">{dict.noteExemple}</p>
            <Link className="bouton bouton-principal" href={`/${lang}/don?projet=${besoinProjet?.id || "dispensaire"}`}>
              {a.soutenir}
            </Link>
          </Apparition>
        </div>
      </section>

      <section className="section" id="projets">
        <Apparition className="section-entete">
          <h2>{a.projetsTitre}</h2>
          <p>{a.projetsIntro}</p>
        </Apparition>
        <ul className="grille">
          {listeProjets.map((p) => (
            <CarteProjet key={p.id} projet={p} dict={dict} lang={lang} />
          ))}
        </ul>
      </section>

      <section className="section section-teintee" id="votre-don">
        <Apparition className="section-entete">
          <h2>{a.impactTitre}</h2>
          <p>{a.impactIntro}</p>
        </Apparition>
        <div className="liste-montants">
          {montantsProposes.ponctuel.map((m) => (
            <Link key={m} href={`/${lang}/don?montant=${m}`}>
              <strong><Montant fcfa={m} lang={lang} /></strong>
              <span>{dict.don.contextes.ponctuel[m]}</span>
            </Link>
          ))}
        </div>
        <p className="note-exemple">{dict.noteExemple}</p>
      </section>

      <section className="section section-sombre">
        <Apparition className="section-entete">
          <h2>{a.etapesTitre}</h2>
        </Apparition>
        <ol className="etapes">
          {a.etapes.map((e) => (
            <li key={e.titre}>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <Parallaxe src={cheminPhoto("station-recharge")} alt={dict.photos["station-recharge"]}>
        <h2>{a.parallaxeTitre}</h2>
        <p>{a.parallaxeTexte}</p>
        <Link className="bouton bouton-or" href={`/${lang}/notre-histoire`}>
          {a.parallaxeLien}
        </Link>
      </Parallaxe>

      <section className="section" id="qui-sommes-nous">
        <Apparition className="duo">
          <div>
            <h2>{a.aproposTitre}</h2>
            {a.aproposTexte.map((para) => (
              <p key={para.slice(0, 20)}>{para}</p>
            ))}
            <Link className="lien-fleche" href={`/${lang}/qui-sommes-nous`}>
              {a.aproposLien}
            </Link>
          </div>
          <div className="duo-image">
            <Image src={cheminPhoto("equipe-batack")} alt={dict.photos["equipe-batack"]} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </Apparition>
      </section>

      <section className="appel">
        <h2>{a.appelTitre}</h2>
        <p>{a.appelTexte}</p>
        <Link className="bouton bouton-or bouton-grand" href={`/${lang}/don`}>
          {a.boutonDon}
        </Link>
      </section>
    </>
  );
}
