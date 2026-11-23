import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { alternatesPage } from "@/i18n/config";
import { cheminPhoto } from "@/donnees/projets";
import { PARITE_FCFA, chargerTransparenceSite } from "@/lib2/serveur";
import Apparition from "@/components/Apparition";
import Compteur from "@/components/Compteur";
import Parallaxe from "@/components/Parallaxe";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return {
    title: `${dict.transparence.titre} | COVIDEBA`,
    description: dict.transparence.intro,
    alternates: alternatesPage(lang, "/transparence"),
  };
}

export default async function Transparence({ params }) {
  const { lang } = await params;
  const [dict, stats] = await Promise.all([chargerDictionnaire(lang), chargerTransparenceSite()]);
  const t = dict.transparence;

  const chiffres = [
    { valeur: stats.collectedFcfa, devise: true },
    { valeur: stats.donorsCount, devise: false },
    { valeur: stats.projectsCount, devise: false },
  ];

  const totalMouvements = stats.balanceFcfa + stats.spentFcfa;
  const partDisponible = totalMouvements > 0 ? Math.round((stats.balanceFcfa / totalMouvements) * 100) : 100;
  const partDepensee = totalMouvements > 0 ? Math.max(0, 100 - partDisponible) : 0;
  const parts = [
    { pourcent: partDisponible, couleur: "var(--principal)" },
    { pourcent: 0, couleur: "var(--or)" },
    { pourcent: partDepensee, couleur: "var(--vert-nuit)" },
  ];

  const formaterMontant = (eur) =>
    new Intl.NumberFormat(lang, { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(
      Math.round(Number(eur || 0) * PARITE_FCFA),
    );
  const formaterDate = (d) => new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date(d));

  return (
    <>
      <Parallaxe src={cheminPhoto("cablage")} alt={dict.photos["cablage"]} prioritaire>
        <h1>{t.titre}</h1>
        <p>{t.intro}</p>
      </Parallaxe>

      <section className="section section-sombre">
        <Apparition className="section-entete">
          <h2>{t.chiffresTitre}</h2>
        </Apparition>
        <div className="chiffres">
          {chiffres.map((c, i) => (
            <div className="chiffre" key={t.chiffres[i]}>
              <Compteur valeur={c.valeur} langue={lang} devise={c.devise} />
              <span>{t.chiffres[i]}</span>
            </div>
          ))}
        </div>
        {!stats.depuisBackend && <p className="note-exemple">{t.miseAJour}</p>}
      </section>

      <section className="section">
        <Apparition className="duo">
          <div>
            <h2>{t.repartitionTitre}</h2>
            <p>{t.repartitionIntro}</p>
            <p className="aide">{t.methode}</p>
          </div>
          <div>
            <div
              className="repartition"
              role="img"
              aria-label={t.parts.map((p, i) => `${p} ${parts[i].pourcent} %`).join(", ")}
            >
              {parts.map((p, i) => (
                <span key={t.parts[i]} style={{ width: `${p.pourcent}%`, background: p.couleur }} />
              ))}
            </div>
            <ul className="legende">
              {parts.map((p, i) => (
                <li key={t.parts[i]}>
                  <i style={{ background: p.couleur }} />
                  <b>{p.pourcent} %</b>
                  <span>{t.parts[i]}</span>
                </li>
              ))}
            </ul>
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
              {stats.recentEntries.length === 0 ? (
                <tr className="tableau-vide">
                  <td colSpan={t.colonnes.length}>{t.registreVide}</td>
                </tr>
              ) : (
                stats.recentEntries.map((e) => (
                  <tr key={e.entry_number}>
                    <td>{formaterDate(e.entry_date)}</td>
                    <td>{e.label}</td>
                    <td>{e.account}</td>
                    <td className="nombre">{e.direction === "entree" ? formaterMontant(e.amount_eur_equiv) : ""}</td>
                    <td className="nombre">{e.direction === "sortie" ? formaterMontant(e.amount_eur_equiv) : ""}</td>
                    <td><code>{String(e.entry_hash || "").slice(0, 8)}</code></td>
                  </tr>
                ))
              )}
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
