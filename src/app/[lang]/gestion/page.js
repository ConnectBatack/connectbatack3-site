import Link from "next/link";
import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { chargerInstancePlanGestion, chargerRegistreGestion } from "@/lib2/serveur";
import TableauEcritures from "@/components/gestion/TableauEcritures";
import { formatFcfa } from "@/lib/monnaie";

export default async function TableauDeBord({ params }) {
  const { lang } = await params;
  const session = await exigerSession(lang);
  const [g, reg, plan] = await Promise.all([
    chargerGestion(lang),
    chargerRegistreGestion(10),
    chargerInstancePlanGestion(),
  ]);
  const l = langueGestion(lang);
  const t = g.tableau;
  const euro = (n) => formatFcfa(l, n);

  const soldeFcfa = reg.summary ? Number(reg.summary.available_balance_fcfa || 0) : plan.instance.S0;
  const reserveFcfa = plan.instance.Smin;
  const donsMoisFcfa = plan.instance.D?.[0] || 0;
  const aContresigner = reg.summary
    ? Number(reg.summary.pending_countersign_count || 0)
    : reg.ecritures.filter((e) => e.etat === "a_contresigner").length;

  const indicateurs = [
    [t.solde, euro(soldeFcfa)],
    [t.reserve, euro(reserveFcfa)],
    [t.donsMois, euro(donsMoisFcfa)],
    [t.aContresigner, String(aContresigner)],
  ];

  const raccourcis = [
    { href: `/${lang}/gestion/projets`, titre: t.raccourcis.projetsTitre, texte: t.raccourcis.projetsTexte },
    { href: `/${lang}/gestion/parametres`, titre: t.raccourcis.parametresTitre, texte: t.raccourcis.parametresTexte },
    { href: `/${lang}/gestion/registre`, titre: t.raccourcis.registreTitre, texte: t.raccourcis.registreTexte },
    { href: `/${lang}/gestion/plan`, titre: t.raccourcis.planTitre, texte: t.raccourcis.planTexte },
  ];

  return (
    <>
      <h1>{t.bienvenue.replace("{nom}", session.nom)}</h1>
      <p className="gestion-intro">{t.raccourcisTitre}</p>
      {(!reg.depuisBackend || !plan.depuisBackend) && <p className="note-exemple">{g.exempleMaquette}</p>}

      <div className="admin-raccourcis">
        {raccourcis.map((r) => (
          <Link key={r.href} href={r.href} className="admin-raccourci-carte">
            <strong>{r.titre}</strong>
            <span>{r.texte}</span>
          </Link>
        ))}
      </div>

      <ul className="indicateurs">
        {indicateurs.map(([libelle, valeur]) => (
          <li key={libelle}>
            <span>{libelle}</span>
            <strong>{valeur}</strong>
          </li>
        ))}
      </ul>

      <h2>{t.derniersTitre}</h2>
      <TableauEcritures ecritures={reg.ecritures.slice(0, 5)} g={g} langue={l} />
      <Link className="lien-fleche" href={`/${lang}/gestion/registre`}>{t.voirRegistre}</Link>
    </>
  );
}
