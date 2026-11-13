import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { instanceExemple } from "@/donnees/exemple-gestion";
import Planificateur from "@/components/gestion/Planificateur";

export default async function PagePlan({ params }) {
  const { lang } = await params;
  await exigerSession(lang); // vérification à chaque page, pas seulement dans la mise en page
  const g = await chargerGestion(lang);
  return (
    <>
      <h1>{g.plan.titre}</h1>
      <p className="gestion-intro">{g.plan.intro}</p>
      <Planificateur t={g.plan} langue={langueGestion(lang)} instanceInitiale={instanceExemple} />
    </>
  );
}
