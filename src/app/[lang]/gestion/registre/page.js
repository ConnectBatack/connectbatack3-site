import { exigerSession } from "@/lib/session";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { chargerRegistreGestion } from "@/lib2/serveur";
import TableauEcritures from "@/components/gestion/TableauEcritures";

export default async function Registre({ params }) {
  const { lang } = await params;
  await exigerSession(lang);
  const [g, reg] = await Promise.all([chargerGestion(lang), chargerRegistreGestion(100)]);
  const r = g.registre;
  return (
    <>
      <h1>{r.titre}</h1>
      <p className="gestion-intro">{r.intro}</p>
      {!reg.depuisBackend && <p className="note-exemple">{g.exempleMaquette}</p>}
      <TableauEcritures ecritures={reg.ecritures} g={g} langue={langueGestion(lang)} />
      <p className="aide">{r.parite}</p>
    </>
  );
}
