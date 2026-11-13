import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { ecrituresExemple } from "@/donnees/exemple-gestion";
import TableauEcritures from "@/components/gestion/TableauEcritures";

export default async function Registre({ params }) {
  const { lang } = await params;
  await exigerSession(lang); // vérification à chaque page, pas seulement dans la mise en page
  const g = await chargerGestion(lang);
  const r = g.registre;
  return (
    <>
      <h1>{r.titre}</h1>
      <p className="gestion-intro">{r.intro}</p>
      <p className="note-exemple">{g.plan.exemple}</p>
      <TableauEcritures ecritures={ecrituresExemple} g={g} langue={langueGestion(lang)} />
      <p className="aide">{r.parite}</p>
      <button type="button" className="bouton bouton-principal" disabled title={r.nouvelleMaquette}>
        {r.nouvelle}
      </button>
      <p className="aide">{r.nouvelleMaquette}</p>
    </>
  );
}
