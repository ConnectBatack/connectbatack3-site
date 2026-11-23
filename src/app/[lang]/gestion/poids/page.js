import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { chargerInstancePlanGestion } from "@/lib2/serveur";
import OutilAhp from "@/components/gestion/OutilAhp";

export default async function PagePoids({ params }) {
  const { lang } = await params;
  await exigerSession(lang);
  const [g, plan] = await Promise.all([chargerGestion(lang), chargerInstancePlanGestion()]);
  return (
    <>
      <h1>{g.poids.titre}</h1>
      <p className="gestion-intro">{g.poids.intro}</p>
      {!plan.depuisBackend && <p className="note-exemple">{g.exempleMaquette}</p>}
      <OutilAhp
        t={g.poids}
        langue={langueGestion(lang)}
        taches={plan.instance.taches}
        nomCritere={g.poids.critere}
      />
    </>
  );
}
