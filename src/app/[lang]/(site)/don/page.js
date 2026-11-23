import { Suspense } from "react";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { alternatesPage } from "@/i18n/config";
import { DON_MENSUEL_ACTIF } from "@/lib/regles-don";
import { chargerInfosCovideba, chargerProjetsSite } from "@/lib2/serveur";
import FormulaireDon, { FormulaireDonDepuisAdresse } from "@/components/FormulaireDon";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.don.titre} | COVIDEBA`, alternates: alternatesPage(lang, "/don") };
}

export default async function PageDon({ params }) {
  const { lang } = await params;
  const [dict, { comptes }, listeProjets] = await Promise.all([
    chargerDictionnaire(lang),
    chargerInfosCovideba(),
    chargerProjetsSite(),
  ]);
  const titresProjets = Object.fromEntries(
    listeProjets.map((p) => [
      p.id,
      p.textes?.title?.[lang] || p.textes?.title?.fr || dict.projets[p.id]?.titre || p.id,
    ]),
  );
  const faq = dict.don.faq;
  const proprietes = {
    t: dict.don,
    exemple: dict.exemple,
    titresProjets,
    langue: lang,
    comptes,
    liens: { conditions: `/${lang}/informations/conditions`, confidentialite: `/${lang}/informations/confidentialite` },
  };

  return (
    <>
      <section className="section section-don">
        <div className="section-entete">
          <h1>{dict.don.titre}</h1>
          <p>{dict.don.intro}</p>
        </div>
        <Suspense fallback={<FormulaireDon {...proprietes} />}>
          <FormulaireDonDepuisAdresse {...proprietes} messageAnnule={dict.merci.annule} />
        </Suspense>
      </section>

      <section className="section section-don">
        <div className="section-entete">
          <h2>{faq.titre}</h2>
        </div>
        <div className="faq">
          {/* La question 3 porte sur l'arrêt du don mensuel. */}
          {[1, 2, 3, 4, 5].filter((n) => DON_MENSUEL_ACTIF || n !== 3).map((n) => (
            <details key={n}>
              <summary>{faq[`q${n}`]}</summary>
              <p>{faq[`r${n}`]}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
