import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { projets } from "@/donnees/projets";
import { montantsProposes } from "@/lib/regles-don";
import Apparition from "@/components/Apparition";

const formatEuro = (lang, n) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default async function Accueil({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const a = dict.accueil;

  return (
    <>
      <section className="hero">
        <div className="hero-texte">
          <p className="surtitre">{a.surtitre}</p>
          <h1>{a.titre}</h1>
          <p className="hero-intro">{a.intro}</p>
          <div className="hero-actions">
            <Link className="bouton bouton-principal bouton-grand" href={`/${lang}/don`}>
              {a.boutonDon}
            </Link>
            <Link className="bouton bouton-contour bouton-grand" href={`/${lang}#projets`}>
              {a.boutonProjets}
            </Link>
          </div>
        </div>
        <Apparition className="hero-visuel">
          <div className="carte-besoin">
            <p className="carte-categorie">
              {a.prochainBesoin} <span className="badge-exemple">{dict.exemple}</span>
            </p>
            <h2>{a.besoinTitre}</h2>
            <p>{a.besoinTexte}</p>
            <div className="progression" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
              <span className="progression-barre" style={{ "--p": "35%" }} />
            </div>
            <p className="progression-texte">
              <strong>{formatEuro(lang, 1400)}</strong> {a.collecte} {formatEuro(lang, 4000)}
            </p>
            <Link className="bouton bouton-principal" href={`/${lang}/don?projet=dispensaire`}>
              {a.soutenir}
            </Link>
          </div>
        </Apparition>
      </section>

      <section className="section" id="projets">
        <Apparition className="section-entete">
          <h2>{a.projetsTitre}</h2>
          <p>{a.projetsIntro}</p>
        </Apparition>
        <div className="grille">
          {projets.map((p) => {
            const t = dict.projets[p.id];
            const pourcent = Math.min(100, Math.round((p.collecte / p.objectif) * 100));
            return (
              <Apparition as="article" className={`carte carte-${p.couleur}`} key={p.id}>
                <p className="carte-categorie">
                  {t.categorie} <span className="badge-exemple">{dict.exemple}</span>
                </p>
                <h3>{t.titre}</h3>
                <p>{t.description}</p>
                <div
                  className="progression"
                  role="progressbar"
                  aria-valuenow={pourcent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span className="progression-barre" style={{ "--p": `${pourcent}%` }} />
                </div>
                <p className="progression-texte">
                  <strong>{formatEuro(lang, p.collecte)}</strong> {a.collecte}{" "}
                  {formatEuro(lang, p.objectif)}
                </p>
                <Link className="bouton bouton-carte" href={`/${lang}/don?projet=${p.id}`}>
                  {a.soutenir}
                </Link>
              </Apparition>
            );
          })}
        </div>
      </section>

      <section className="section section-teintee" id="votre-don">
        <Apparition className="section-entete">
          <h2>{a.impactTitre}</h2>
          <p>{a.impactIntro}</p>
        </Apparition>
        <div className="grille grille-montants">
          {montantsProposes.ponctuel.map((m) => (
            <Apparition key={m}>
              <Link className="tuile-montant" href={`/${lang}/don?montant=${m}`}>
                <strong>{formatEuro(lang, m)}</strong>
                <span>{dict.don.contextes.ponctuel[m]}</span>
                <span className="badge-exemple">{dict.exemple}</span>
              </Link>
            </Apparition>
          ))}
        </div>

        <Apparition className="section-entete">
          <h2>{a.etapesTitre}</h2>
        </Apparition>
        <ol className="grille etapes">
          {a.etapes.map((e, i) => (
            <Apparition as="li" key={e.titre}>
              <span className="etape-numero">{i + 1}</span>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </Apparition>
          ))}
        </ol>
      </section>

      <section className="section" id="qui-sommes-nous">
        <Apparition className="apropos">
          <h2>{a.aproposTitre}</h2>
          {a.aproposTexte.map((para) => (
            <p key={para.slice(0, 20)}>{para}</p>
          ))}
        </Apparition>
      </section>

      <section className="appel">
        <h2>{a.appelTitre}</h2>
        <p>{a.appelTexte}</p>
        <Link className="bouton bouton-blanc bouton-grand" href={`/${lang}/don`}>
          {a.boutonDon}
        </Link>
      </section>
    </>
  );
}
