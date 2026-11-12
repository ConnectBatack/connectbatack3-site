// Tableau des écritures du registre (lecture seule).
export default function TableauEcritures({ ecritures, g, langue }) {
  const c = g.registre.colonnes;
  const montant = (n, devise) =>
    n ? new Intl.NumberFormat(langue, { style: "currency", currency: devise === "FCFA" ? "XAF" : "EUR", maximumFractionDigits: 0 }).format(n) : "";
  const date = (d) => new Intl.DateTimeFormat(langue, { dateStyle: "medium" }).format(new Date(d));

  return (
    <div className="tableau-defilant">
      <table className="tableau">
        <thead>
          <tr>
            <th scope="col">{c.numero}</th>
            <th scope="col">{c.date}</th>
            <th scope="col">{c.libelle}</th>
            <th scope="col">{c.compte}</th>
            <th scope="col" className="nombre">{c.entree}</th>
            <th scope="col" className="nombre">{c.sortie}</th>
            <th scope="col">{c.etat}</th>
            <th scope="col">{c.hash}</th>
          </tr>
        </thead>
        <tbody>
          {ecritures.map((e) => (
            <tr key={e.numero}>
              <td>{e.numero}</td>
              <td>{date(e.date)}</td>
              <td>{e.libelle}</td>
              <td>{e.compte}</td>
              <td className="nombre">{montant(e.entree, e.devise)}</td>
              <td className="nombre">{montant(e.sortie, e.devise)}</td>
              <td>
                <span className={`etat etat-${e.etat}`}>{g.registre.etats[e.etat]}</span>
              </td>
              <td><code>{e.hash}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
