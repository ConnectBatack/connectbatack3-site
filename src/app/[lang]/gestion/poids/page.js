import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { instanceExemple } from "@/donnees/exemple-gestion";
import OutilAhp from "@/components/gestion/OutilAhp";

export default async function PagePoids({ params }) {
  const { lang } = await params;
  const g = await chargerGestion(lang);
  return (
    <>
      <h1>{g.poids.titre}</h1>
      <p className="gestion-intro">{g.poids.intro}</p>
      <p className="note-exemple">{g.plan.exemple}</p>
      <OutilAhp t={g.poids} langue={langueGestion(lang)} taches={instanceExemple.taches} nomCritere={g.poids.critere} />
    </>
  );
}
