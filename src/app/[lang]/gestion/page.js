import { exigerSession } from "@/lib/session";
import Link from "next/link";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { instanceExemple, ecrituresExemple } from "@/donnees/exemple-gestion";
import TableauEcritures from "@/components/gestion/TableauEcritures";

export default async function TableauDeBord({ params }) {
  const { lang } = await params;
  await exigerSession(lang); // vérification à chaque page, pas seulement dans la mise en page
  const g = await chargerGestion(lang);
  const l = langueGestion(lang);
  const t = g.tableau;
  const euro = (n) => new Intl.NumberFormat(l, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const aContresigner = ecrituresExemple.filter((e) => e.etat === "a_contresigner").length;

  const indicateurs = [
    [t.solde, euro(instanceExemple.S0)],
    [t.reserve, euro(instanceExemple.Smin)],
    [t.donsMois, euro(instanceExemple.D[0])],
    [t.aContresigner, String(aContresigner)],
  ];

  return (
    <>
      <h1>{t.titre}</h1>
      <p className="note-exemple">{g.plan.exemple}</p>
      <ul className="indicateurs">
        {indicateurs.map(([libelle, valeur]) => (
          <li key={libelle}>
            <span>{libelle}</span>
            <strong>{valeur}</strong>
          </li>
        ))}
      </ul>

      <h2>{t.actionsTitre}</h2>
      <ul className="liste-actions">
        <li><Link href={`/${lang}/gestion/plan`}>{t.actionPlan}</Link></li>
        <li><Link href={`/${lang}/gestion/registre`}>{t.actionContresigner}</Link></li>
      </ul>

      <h2>{t.derniersTitre}</h2>
      <TableauEcritures ecritures={ecrituresExemple.slice(0, 3)} g={g} langue={l} />
      <Link className="lien-fleche" href={`/${lang}/gestion/registre`}>{t.voirRegistre}</Link>
    </>
  );
}
