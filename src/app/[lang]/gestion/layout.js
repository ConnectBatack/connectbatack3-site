import { chargerGestion, langueGestion } from "@/i18n/gestion";
import MenuGestion from "@/components/gestion/MenuGestion";
import { lireSession } from "@/lib/session";
import { RegistreFinancierChaNService } from "@/lib2/serveur";

export const metadata = { robots: { index: false, follow: false } };

// Habillage de l'espace COVIDEBA : barre latérale style Gmail avec les outils du comité.
export default async function MiseEnPageGestion({ children, params }) {
  const { lang } = await params;
  const [g, session] = await Promise.all([chargerGestion(lang), lireSession()]);
  const l = langueGestion(lang);

  let pendingCount = 0;
  if (session && !session.mustChangePassword) {
    const summary = await RegistreFinancierChaNService.getSummaryApiV1RegistrySummaryGet().catch(
      () => null,
    );
    pendingCount = Number(summary?.pending_countersign_count || 0);
  }

  const groupes = [
    {
      titre: l === "en" ? "Main" : "Principal",
      liens: [
        { href: `/${lang}/gestion`, texte: g.menu.tableau, icone: "tableau" },
        { href: `/${lang}/gestion/projets`, texte: g.menu.projets, icone: "projets" },
        {
          href: `/${lang}/gestion/registre`,
          texte: g.menu.registre,
          icone: "registre",
          badge: pendingCount,
        },
      ],
    },
    {
      titre: l === "en" ? "Committee tools" : "Outils du comité",
      liens: [
        { href: `/${lang}/gestion/poids`, texte: g.menu.poids, icone: "poids" },
        { href: `/${lang}/gestion/plan`, texte: g.menu.plan, icone: "plan" },
      ],
    },
    {
      titre: l === "en" ? "Settings" : "Administration",
      liens: [
        { href: `/${lang}/gestion/parametres`, texte: g.menu.parametres, icone: "parametres" },
      ],
    },
  ];

  return (
    <>
      <a className="lien-evitement" href="#contenu-gestion">
        {g.allerContenu}
      </a>
      <div className="gmail-shell">
        <MenuGestion
          lang={lang}
          langueUi={l}
          titreEspace={g.titreEspace}
          labelNouveauProjet={l === "en" ? "New project" : "Nouveau projet"}
          groupes={groupes}
          utilisateur={{
            nom: session?.nom || g.utilisateur,
            role: session?.role || "",
          }}
          labelSite={g.menu.site}
          labelDeconnexion={g.menu.deconnexion}
        />
        <main id="contenu-gestion" className="gmail-contenu">
          {children}
        </main>
      </div>
    </>
  );
}
