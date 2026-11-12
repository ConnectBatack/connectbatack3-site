import Image from "next/image";
import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";
import Parallaxe from "@/components/Parallaxe";
import logoCovideba from "../../../../../public/images/logos/logo-covideba.png";

// Noms propres : identiques dans toutes les langues. Les rôles sont dans les dictionnaires.
const encadrants = [
  { id: "dehombreux", nom: "Pr Pierre Dehombreux" },
  { id: "fokam", nom: "Pr Christian Fokam Bopda" },
  { id: "chengoue", nom: "Dr Anatole Chengoué" },
];
const partenaires = [
  { id: "ares", nom: "ARES" },
  { id: "solarly", nom: "Solarly" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.apropos.titre} | ConnectBatack 3`, description: dict.apropos.intro };
}

export default async function QuiSommesNous({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const q = dict.apropos;

  return (
    <>
      <Parallaxe src={cheminPhoto("rencontre-village")} alt={dict.photos["rencontre-village"]}>
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
        <Apparition className="duo duo-inverse">
          <div>
            <h2>{q.equipesTitre}</h2>
            <p>{q.equipesTexte}</p>
            <p className="note-exemple">{q.etudiants}</p>
          </div>
          <div className="duo-image">
            <Image src={cheminPhoto("equipe-dispensaire")} alt={dict.photos["equipe-dispensaire"]} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </Apparition>
      </section>

      <section className="section section-teintee">
        <Apparition className="section-entete">
          <h2>{q.encadrantsTitre}</h2>
        </Apparition>
        <ul className="personnes">
          {encadrants.map((e) => (
            <li key={e.id}>
              <strong>{e.nom}</strong>
              <span>{q.roles[e.id]}</span>
            </li>
          ))}
        </ul>
        <Apparition className="section-entete">
          <h2 className="titre-espace">{q.partenairesTitre}</h2>
        </Apparition>
        <ul className="personnes">
          {partenaires.map((p) => (
            <li key={p.id}>
              <strong>{p.nom}</strong>
              <span>{q.partenaires[p.id]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <Apparition className="section-entete">
          <h2>{q.charteTitre}</h2>
          <p>{q.charteIntro}</p>
        </Apparition>
        <ol className="charte">
          {q.charte.map((c) => (
            <li key={c.slice(0, 24)}>{c}</li>
          ))}
        </ol>
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
