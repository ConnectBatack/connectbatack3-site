import { exigerSession } from "@/lib/session";
import { chargerGestion } from "@/i18n/gestion";
import {
  AdministrationParamTresDuSiteComptesService,
  AdministrationUtilisateursRLesService,
} from "@/lib2/serveur";
import ParametresAdmin from "@/components/gestion/ParametresAdmin";

export default async function PageParametres({ params }) {
  const { lang } = await params;
  const session = await exigerSession(lang);
  const g = await chargerGestion(lang);

  let orgInitiale = null;
  let utilisateursInitiaux = [];

  if (!session.mustChangePassword && session.role === "admin") {
    const [orgData, usersData] = await Promise.all([
      AdministrationParamTresDuSiteComptesService.readOrganizationSettingsApiV1SettingsOrganizationGet().catch(
        () => null,
      ),
      AdministrationUtilisateursRLesService.listUsersApiV1UsersGet(undefined, undefined, 100, 0).catch(
        () => null,
      ),
    ]);
    orgInitiale = orgData;
    utilisateursInitiaux = Array.isArray(usersData?.items) ? usersData.items : [];
  }

  return (
    <>
      <h1>{g.parametres.titre}</h1>
      <p className="gestion-intro">{g.parametres.intro}</p>
      <ParametresAdmin
        t={g.parametres}
        lang={lang}
        session={session}
        orgInitiale={orgInitiale}
        utilisateursInitiaux={utilisateursInitiaux}
      />
    </>
  );
}
