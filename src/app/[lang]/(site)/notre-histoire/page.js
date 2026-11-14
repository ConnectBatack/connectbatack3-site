import Link from "next/link";
import Image from "next/image";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { alternatesPage } from "@/i18n/config";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";
import Parallaxe from "@/components/Parallaxe";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.histoire.titre} | ConnectBatack 3`, description: dict.histoire.intro, alternates: alternatesPage(lang, "/notre-histoire") };
}

export default async function NotreHistoire({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const h = dict.histoire;

  return (
    <>
      <Parallaxe src={cheminPhoto("batack-paysage")} alt={dict.photos["batack-paysage"]} prioritaire>
        <h1>{h.titre}</h1>
        <p>{h.intro}</p>
      </Parallaxe>

      <section className="section">
        <Apparition className="section-entete">
          <h2>{h.friseTitre}</h2>
        </Apparition>
        <ol className="frise">
          {h.etapes.map((e) => (
            <Apparition as="li" key={e.titre}>
              <p className="frise-date">
                {/* La date exacte de Connect Batack 1 reste à trouver (dateACompleter dans les dictionnaires).
                    La mention « à compléter » n'est plus montrée aux visiteurs (décision de Roy, 14/11/2026). */}
                {e.date}
              </p>
              <div className={`frise-texte ${e.photo ? "" : "sans-image"}`}>
                <div>
                  <h3>{e.titre}</h3>
                  <p>{e.texte}</p>
                </div>
                {e.photo && (
                  <div className="frise-photo">
                    <Image src={cheminPhoto(e.photo)} alt={dict.photos[e.photo]} fill sizes="(max-width: 900px) 100vw, 300px" />
                  </div>
                )}
              </div>
            </Apparition>
          ))}
        </ol>
      </section>

      <section className="section section-teintee">
        <Apparition className="section-entete">
          <h2>{h.aujourdhuiTitre}</h2>
          <p>{h.aujourdhuiIntro}</p>
        </Apparition>
        <ul className="galerie">
          {h.lieux.map((l) => (
            <Apparition as="li" key={l.photo}>
              <figure>
                <div className="galerie-photo">
                  <Image src={cheminPhoto(l.photo)} alt={dict.photos[l.photo]} fill sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <figcaption>
                  <strong>{l.titre}</strong>
                  {l.texte}
                </figcaption>
              </figure>
            </Apparition>
          ))}
        </ul>
      </section>

      <section className="appel">
        <h2>{h.appelTitre}</h2>
        <p>{h.appelTexte}</p>
        <Link className="bouton bouton-or bouton-grand" href={`/${lang}/don`}>
          {dict.nav.don}
        </Link>
      </section>
    </>
  );
}
