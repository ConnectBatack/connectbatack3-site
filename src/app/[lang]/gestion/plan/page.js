import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { chargerInstancePlanGestion } from "@/lib2/serveur";
import Planificateur from "@/components/gestion/Planificateur";

export default async function PagePlan({ params }) {
  const { lang } = await params;
  await exigerSession(lang);
  const [g, plan] = await Promise.all([chargerGestion(lang), chargerInstancePlanGestion()]);
  return (
    <>
      <h1>{g.plan.titre}</h1>
      <p className="gestion-intro">{g.plan.intro}</p>
      {!plan.depuisBackend && <p className="note-exemple">{g.exempleMaquette}</p>}
      <Planificateur t={g.plan} langue={langueGestion(lang)} instanceInitiale={plan.instance} />
    </>
  );
}
