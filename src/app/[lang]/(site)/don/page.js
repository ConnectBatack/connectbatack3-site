import { Suspense } from "react";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { idsProjets } from "@/donnees/projets";
import { alternatesPage } from "@/i18n/config";
import FormulaireDon, { FormulaireDonDepuisAdresse } from "@/components/FormulaireDon";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return { title: `${dict.don.titre} | ConnectBatack 3`, alternates: alternatesPage(lang, "/don") };
}

// Page statique : les paramètres d'adresse (?projet=, ?montant=, ?annule=) sont lus dans le navigateur.
export default async function PageDon({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const titresProjets = Object.fromEntries(idsProjets.map((id) => [id, dict.projets[id].titre]));
  const faq = dict.don.faq;
  const proprietes = {
    t: dict.don,
    exemple: dict.exemple,
    titresProjets,
    langue: lang,
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
          {[1, 2, 3, 4, 5].map((n) => (
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
