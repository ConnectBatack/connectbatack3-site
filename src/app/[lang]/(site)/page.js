import Link from "next/link";
import Image from "next/image";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { projets, cheminPhoto } from "@/donnees/projets";
import { montantsProposes } from "@/lib/regles-don";
import Apparition from "@/components/Apparition";
import Diaporama from "@/components/Diaporama";
import Parallaxe from "@/components/Parallaxe";
import CarteProjet from "@/components/CarteProjet";

const formatEuro = (lang, n) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Photos du diaporama d'accueil, dans l'ordre d'affichage.
const photosAccueil = ["batack-paysage", "accueil-chants", "installation-electrique", "ecole-publique", "marche"];

export default async function Accueil({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const a = dict.accueil;

  return (
    <>
      <section className="bandeau-photo">
        <Diaporama
          libelle={dict.nav.diapos}
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
            <h2>{a.besoinTitre}</h2>
            <p>{a.besoinTexte}</p>
            <div className="progression" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
              <span className="progression-barre" style={{ "--p": "35%" }} />
            </div>
            <p className="progression-texte">
              <strong>{formatEuro(lang, 1400)}</strong> {a.collecte} {formatEuro(lang, 4000)}
            </p>
            <p className="note-exemple">{dict.noteExemple}</p>
            <Link className="bouton bouton-principal" href={`/${lang}/don?projet=dispensaire`}>
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
          {projets.map((p) => (
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
              <strong>{formatEuro(lang, m)}</strong>
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
