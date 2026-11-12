import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { cheminPhoto } from "@/donnees/projets";
import Apparition from "@/components/Apparition";
import Compteur from "@/components/Compteur";
import Parallaxe from "@/components/Parallaxe";

// DONNÉES D'EXEMPLE : elles seront calculées à partir du registre comptable
// quand la base de données existera.
const chiffresExemple = [
  { valeur: 6050, devise: true },
  { valeur: 87, devise: false },
  { valeur: 0, devise: false },
];
const partsExemple = [
  { pourcent: 90, couleur: "var(--principal)" },
  { pourcent: 4, couleur: "var(--or)" },
  { pourcent: 6, couleur: "var(--vert-nuit)" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.transparence.titre} | ConnectBatack 3`, description: dict.transparence.intro };
}

export default async function Transparence({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const t = dict.transparence;

  return (
    <>
      <Parallaxe src={cheminPhoto("cablage")} alt={dict.photos["cablage"]}>
        <h1>{t.titre}</h1>
        <p>{t.intro}</p>
      </Parallaxe>

      <section className="section section-sombre">
        <Apparition className="section-entete">
          <h2>{t.chiffresTitre}</h2>
        </Apparition>
        <div className="chiffres">
          {chiffresExemple.map((c, i) => (
            <div className="chiffre" key={t.chiffres[i]}>
              <Compteur valeur={c.valeur} langue={lang} devise={c.devise} />
              <span>{t.chiffres[i]}</span>
            </div>
          ))}
        </div>
        <p className="note-exemple">{t.miseAJour}</p>
      </section>

      <section className="section">
        <Apparition className="duo">
          <div>
            <h2>{t.repartitionTitre}</h2>
            <p>{t.repartitionIntro}</p>
            <p className="aide">{t.methode}</p>
          </div>
          <div>
            <div className="repartition" role="img" aria-label={t.parts.map((p, i) => `${p} ${partsExemple[i].pourcent} %`).join(", ")}>
              {partsExemple.map((p, i) => (
                <span key={t.parts[i]} style={{ width: `${p.pourcent}%`, background: p.couleur }} />
              ))}
            </div>
            <ul className="legende">
              {partsExemple.map((p, i) => (
                <li key={t.parts[i]}>
                  <i style={{ background: p.couleur }} />
                  <b>{p.pourcent} %</b>
                  <span>{t.parts[i]}</span>
                </li>
              ))}
            </ul>
            <p className="note-exemple">({dict.exemple})</p>
          </div>
        </Apparition>
      </section>

      <section className="section section-teintee">
        <Apparition className="section-entete">
          <h2>{t.registreTitre}</h2>
          <p>{t.registreIntro}</p>
        </Apparition>
        <div className="tableau-defilant">
          <table className="tableau">
            <thead>
              <tr>
                {t.colonnes.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="tableau-vide">
                <td colSpan={t.colonnes.length}>{t.registreVide}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <Apparition className="duo">
          <div>
            <h2>{t.decisionTitre}</h2>
            <ul className="liste-simple">
              {t.decisionPoints.map((p) => (
                <li key={p.slice(0, 24)}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.rapportsTitre}</h2>
            <p>{t.rapportsTexte}</p>
            <Link className="lien-fleche" href={`/${lang}/don`}>
              {dict.nav.don}
            </Link>
          </div>
        </Apparition>
      </section>
    </>
  );
}
