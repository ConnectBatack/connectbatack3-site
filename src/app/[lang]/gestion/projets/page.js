import { exigerSession } from "@/lib/session";
import { chargerGestion } from "@/i18n/gestion";
import { MDiasFichiersLocauxService, ProjetsService } from "@/lib2/serveur";
import GestionProjets from "@/components/gestion/GestionProjets";

export default async function PageGestionProjets({ params, searchParams }) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const session = await exigerSession(lang);
  const g = await chargerGestion(lang);
  const nouveauInitial = query?.nouveau === "1";

  let projets = [];
  let medias = [];
  if (!session.mustChangePassword) {
    const [pList, mRes] = await Promise.all([
      ProjetsService.listProjectsApiV1ProjectsGet(true).catch(() => []),
      MDiasFichiersLocauxService.listMediaApiV1MediaGet("photo", 100, 0).catch(() => ({ items: [] })),
    ]);
    projets = Array.isArray(pList) ? pList : [];
    medias = Array.isArray(mRes?.items) ? mRes.items : [];
  }

  return (
    <>
      <h1>{g.projetsAdmin.titre}</h1>
      <p className="gestion-intro">{g.projetsAdmin.intro}</p>
      <GestionProjets
        t={g.projetsAdmin}
        lang={lang}
        projetsInitiaux={projets}
        mediasInitiaux={medias}
        nouveauInitial={nouveauInitial}
        peutModifier={session.role !== "encadrant" && !session.mustChangePassword}
        estAdmin={session.role === "admin"}
      />
    </>
  );
}
