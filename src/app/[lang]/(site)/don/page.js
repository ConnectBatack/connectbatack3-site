import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { idsProjets } from "@/donnees/projets";
import FormulaireDon from "@/components/FormulaireDon";

export default async function PageDon({ params, searchParams }) {
  const { lang } = await params;
  const recherche = await searchParams;
  const dict = await chargerDictionnaire(lang);

  // Valeurs reçues dans l'adresse (?projet=…&montant=…) : on ne garde que les valeurs connues.
  const projet = idsProjets.includes(recherche.projet) ? recherche.projet : "";
  const montant = /^\d{1,5}$/.test(recherche.montant ?? "") ? Number(recherche.montant) : null;

  const titresProjets = Object.fromEntries(idsProjets.map((id) => [id, dict.projets[id].titre]));
  const faq = dict.don.faq;

  return (
    <>
      <section className="section section-don">
        <div className="section-entete">
          <h1>{dict.don.titre}</h1>
          <p>{dict.don.intro}</p>
        </div>
        {recherche.annule === "1" && <p className="message message-info">{dict.merci.annule}</p>}
        <FormulaireDon
          t={dict.don}
          exemple={dict.exemple}
          titresProjets={titresProjets}
          langue={lang}
          projetInitial={projet}
          montantInitial={montant}
        />
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