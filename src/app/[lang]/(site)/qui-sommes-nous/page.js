import Image from "next/image";
import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { alternatesPage } from "@/i18n/config";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";
import Parallaxe from "@/components/Parallaxe";
import logoCovideba from "../../../../../public/images/logos/logo-covideba.png";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.apropos.titre} | COVIDEBA`, description: dict.apropos.intro, alternates: alternatesPage(lang, "/qui-sommes-nous") };
}

export default async function QuiSommesNous({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const q = dict.apropos;

  return (
    <>
      <Parallaxe src={cheminPhoto("rencontre-village")} alt={dict.photos["rencontre-village"]} prioritaire>
        <h1>{q.titre}</h1>
        <p>{q.intro}</p>
      </Parallaxe>

      <section className="section">
        <Apparition className="duo">
          <div>
            <Image className="logo-covideba" src={logoCovideba} alt="COVIDEBA" />
            <h2>{q.covidebaTitre}</h2>
            {q.covidebaTexte.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="duo-image">
            <Image src={cheminPhoto("accueil-chants")} alt={dict.photos["accueil-chants"]} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </Apparition>
      </section>

      <section className="appel">
        <h2>{dict.accueil.appelTitre}</h2>
        <p>{dict.accueil.appelTexte}</p>
        <Link className="bouton bouton-or bouton-grand" href={`/${lang}/don`}>
          {dict.nav.don}
        </Link>
      </section>
    </>
  );
}
