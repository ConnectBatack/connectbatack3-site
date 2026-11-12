"use client";

import { useEffect, useRef, useState } from "react";
import { validerInstance } from "@/lib/solveur/modele";
import { CLE_POIDS_AHP } from "@/components/gestion/OutilAhp";

const LIMITE_TEMPS_S = 30;

// Écran de calcul du plan : paramètres, tâches, puis résultat du solveur HiGHS (dans un Web Worker).
export default function Planificateur({ t, langue, instanceInitiale }) {
  const [inst, setInst] = useState(instanceInitiale);
  const [resultat, setResultat] = useState(null);
  const [etat, setEtat] = useState("pret"); // pret | chargement | calcul
  const [message, setMessage] = useState("");
  const worker = useRef(null);
  const premierCalcul = useRef(true);

  useEffect(() => () => worker.current?.terminate(), []);

  const euro = (n) => new Intl.NumberFormat(langue, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const nombre = (v) => (v === "" ? NaN : Number(v));

  function modifier(changement) {
    setInst((i) => ({ ...i, ...changement }));
    setResultat(null);
    setMessage("");
  }

  function changerHorizon(valeur) {
    const h = nombre(valeur);
    if (!Number.isInteger(h) || h < 1 || h > 36) return modifier({ h });
    const D = Array.from({ length: h }, (_, k) => inst.D[k] ?? inst.D[inst.D.length - 1] ?? 0);
    modifier({ h, D });
  }

  function changerTache(index, champ, valeur) {
    const taches = inst.taches.map((tache, k) => (k === index ? { ...tache, [champ]: champ === "libelle" ? valeur : nombre(valeur) } : tache));
    modifier({ taches });
  }

  // Précédences saisies comme une liste d'identifiants : « 1, 2 » veut dire « après les tâches 1 et 2 ».
  const predecesseurs = (id) => inst.precedences.filter(([, j]) => j === id).map(([i]) => i).join(", ");
  function changerPredecesseurs(id, texte) {
    const ids = texte.split(/[,; ]+/).filter(Boolean).map(Number);
    const autres = inst.precedences.filter(([, j]) => j !== id);
    modifier({ precedences: [...autres, ...ids.map((i) => [i, id])] });
  }

  function ajouterTache() {
    const id = Math.max(0, ...inst.taches.map((x) => x.id)) + 1;
    modifier({ taches: [...inst.taches, { id, libelle: "", cout: 0, duree: 1, poids: 1 }] });
  }

  function supprimerTache(id) {
    modifier({
      taches: inst.taches.filter((x) => x.id !== id),
      precedences: inst.precedences.filter(([i, j]) => i !== id && j !== id),
    });
  }

  function calculer() {
    const erreurs = validerInstance(inst);
    if (erreurs.length > 0) {
      setResultat({ statut: "erreur", erreurs });
      return;
    }
    if (!worker.current) {
      worker.current = new Worker(new URL("../../lib/solveur/worker.js", import.meta.url), { type: "module" });
      worker.current.onmessage = ({ data }) => {
        setResultat(data);
        setEtat("pret");
      };
    }
    setEtat(premierCalcul.current ? "chargement" : "calcul");
    premierCalcul.current = false;
    setResultat(null);
    worker.current.postMessage({ instance: inst, limiteTempsS: LIMITE_TEMPS_S });
  }

  function exporter() {
    const blob = new Blob([JSON.stringify(inst, null, 2)], { type: "application/json" });
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = `${inst.nom || "instance"}.json`;
    lien.click();
    URL.revokeObjectURL(lien.href);
  }

  // Reprend les poids w_i calculés sur la page AHP (enregistrés dans ce navigateur).
  function appliquerPoidsAhp() {
    let valeurs = null;
    try {
      valeurs = JSON.parse(localStorage.getItem(CLE_POIDS_AHP) ?? "null");
    } catch {
      valeurs = null;
    }
    if (!valeurs) return setMessage(t.ahpAbsent);
    modifier({ taches: inst.taches.map((x) => (x.id in valeurs ? { ...x, poids: valeurs[x.id] } : x)) });
    setMessage(t.ahpApplique);
  }

  async function importer(fichier) {
    if (!fichier) return;
    try {
      const donnees = JSON.parse(await fichier.text());
      const erreurs = validerInstance(donnees);
      if (erreurs.length > 0) throw new Error(erreurs.join(" ; "));
      modifier({ ...donnees, precedences: donnees.precedences ?? [] });
    } catch (e) {
      setMessage(`${t.importErreur} ${e.message}`);
    }
  }

  const libelle = (id) => inst.taches.find((x) => x.id === id)?.libelle || `#${id}`;
  const calculEnCours = etat !== "pret";

  return (
    <div className="planificateur">
      <p className="note-exemple">{t.exemple}</p>

      <section>
        <h2>{t.parametres}</h2>
        <div className="champs-ligne">
          <label className="champ">{t.h}<input type="number" min="1" max="36" value={inst.h} onChange={(e) => changerHorizon(e.target.value)} /></label>
          <label className="champ">{t.S0}<input type="number" min="0" value={inst.S0} onChange={(e) => modifier({ S0: nombre(e.target.value) })} /></label>
          <label className="champ">{t.Smin}<input type="number" min="0" value={inst.Smin} onChange={(e) => modifier({ Smin: nombre(e.target.value) })} /></label>
          <label className="champ">{t.delta}<input type="number" min="0" step="0.01" value={inst.delta} onChange={(e) => modifier({ delta: nombre(e.target.value) })} /></label>
        </div>
        <fieldset className="dons-mois">
          <legend>{t.dons}</legend>
          {inst.D.map((d, k) => (
            <label key={k} className="champ">
              {t.mois} {k + 1}
              <input type="number" min="0" value={d} onChange={(e) => modifier({ D: inst.D.map((v, j) => (j === k ? nombre(e.target.value) : v)) })} />
            </label>
          ))}
        </fieldset>
      </section>

      <section>
        <h2>{t.taches}</h2>
        <div className="tableau-defilant">
          <table className="tableau tableau-saisie">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t.colonnes.libelle}</th>
                <th scope="col">{t.colonnes.cout}</th>
                <th scope="col">{t.colonnes.duree}</th>
                <th scope="col">{t.colonnes.poids}</th>
                <th scope="col">{t.colonnes.apres}</th>
                <th scope="col"><span className="visuellement-cache">{t.supprimer}</span></th>
              </tr>
            </thead>
            <tbody>
              {inst.taches.map((tache, k) => (
                <tr key={tache.id}>
                  <td>{tache.id}</td>
                  <td><input aria-label={t.colonnes.libelle} value={tache.libelle} onChange={(e) => changerTache(k, "libelle", e.target.value)} /></td>
                  <td><input aria-label={t.colonnes.cout} type="number" min="0" value={tache.cout} onChange={(e) => changerTache(k, "cout", e.target.value)} /></td>
                  <td><input aria-label={t.colonnes.duree} type="number" min="1" value={tache.duree} onChange={(e) => changerTache(k, "duree", e.target.value)} /></td>
                  <td><input aria-label={t.colonnes.poids} type="number" min="0" step="0.1" value={tache.poids} onChange={(e) => changerTache(k, "poids", e.target.value)} /></td>
                  <td><ChampPredecesseurs key={predecesseurs(tache.id)} valeur={predecesseurs(tache.id)} placeholder={t.aucune} libelle={t.colonnes.apres} surValidation={(v) => changerPredecesseurs(tache.id, v)} /></td>
                  <td><button type="button" className="bouton-texte" onClick={() => supprimerTache(tache.id)}>{t.supprimer}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="actions-taches">
          <button type="button" className="bouton bouton-contour bouton-sombre" onClick={ajouterTache}>{t.ajouter}</button>
          <button type="button" className="bouton-texte" onClick={appliquerPoidsAhp}>{t.appliquerAhp}</button>
        </div>
      </section>

      <div className="actions-plan">
        <button type="button" className="bouton bouton-principal bouton-grand" onClick={calculer} disabled={calculEnCours}>
          {calculEnCours ? t.calcul : t.calculer}
        </button>
        <button type="button" className="bouton-texte" onClick={exporter}>{t.exporter}</button>
        <label className="bouton-texte">
          {t.importer}
          <input type="file" accept="application/json,.json" className="visuellement-cache" onChange={(e) => importer(e.target.files?.[0])} />
        </label>
        <button type="button" className="bouton-texte" onClick={() => modifier(instanceInitiale)}>{t.reinitialiser}</button>
      </div>
      {etat === "chargement" && <p className="aide" aria-live="polite">{t.chargement}</p>}
      {message && <p className="message message-erreur" role="alert">{message}</p>}

      {resultat && <Resultat resultat={resultat} inst={inst} t={t} euro={euro} libelle={libelle} />}
    </div>
  );
}

// Champ texte des prédécesseurs : la valeur n'est appliquée qu'en quittant le champ.
// Le parent le recrée (attribut key) quand la valeur enregistrée change.
function ChampPredecesseurs({ valeur, placeholder, libelle, surValidation }) {
  const [texte, setTexte] = useState(valeur);
  return (
    <input aria-label={libelle} value={texte} placeholder={placeholder} onChange={(e) => setTexte(e.target.value)} onBlur={() => surValidation(texte)} />
  );
}

function Resultat({ resultat, inst, t, euro, libelle }) {
  const [valide, setValide] = useState(false);

  if (resultat.statut === "infaisable") return <p className="message message-erreur" role="alert">{t.infaisable}</p>;
  if (resultat.statut === "erreur") {
    return (
      <div className="message message-erreur" role="alert">
        {t.erreur}
        <ul>{(resultat.erreurs ?? [resultat.detail]).map((e) => <li key={e}>{e}</li>)}</ul>
      </div>
    );
  }

  const maxSolde = Math.max(...resultat.soldes, inst.Smin, 1);
  const lancees = new Set(resultat.lancements.map((l) => l.id));
  const nonLancees = inst.taches.filter((x) => !lancees.has(x.id));

  return (
    <section className="resultat-plan" aria-live="polite">
      <h2>{t.resultatTitre}</h2>
      <p className={resultat.statut === "optimal" ? "message message-info" : "message message-erreur"}>
        {resultat.statut === "optimal" ? t.optimal : t.limiteTemps}
      </p>
      <ul className="indicateurs">
        <li><span>{t.valeur}</span><strong>{resultat.valeur.toFixed(2)}</strong></li>
        <li><span>{t.temps}</span><strong>{resultat.temps_calcul_s.toFixed(2)} s</strong></li>
      </ul>
      <div className="tableau-defilant">
        <table className="tableau">
          <thead>
            <tr>
              <th scope="col">{t.calendrier.mois}</th>
              <th scope="col">{t.calendrier.lancees}</th>
              <th scope="col" className="nombre">{t.calendrier.depenses}</th>
              <th scope="col" className="nombre">{t.calendrier.dons}</th>
              <th scope="col">{t.calendrier.solde}</th>
            </tr>
          </thead>
          <tbody>
            {resultat.soldes.map((solde, k) => {
              const mois = k + 1;
              const ids = resultat.lancements.filter((l) => l.mois === mois).map((l) => l.id);
              const depenses = ids.reduce((s, id) => s + inst.taches.find((x) => x.id === id).cout, 0);
              return (
                <tr key={mois} className={mois === 1 ? "ligne-mois1" : ""}>
                  <td>{mois}</td>
                  <td>{ids.length ? ids.map(libelle).join(", ") : "·"}</td>
                  <td className="nombre">{depenses ? euro(depenses) : ""}</td>
                  <td className="nombre">{euro(inst.D[k])}</td>
                  <td>
                    <span className="barre-solde">
                      <span style={{ width: `${(solde / maxSolde) * 100}%` }} />
                      <i style={{ left: `${(inst.Smin / maxSolde) * 100}%` }} />
                    </span>
                    {euro(solde)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="aide">{t.mois1}</p>
      {nonLancees.length > 0 && (
        <p className="aide"><strong>{t.nonLancees}</strong> {nonLancees.map((x) => x.libelle || `#${x.id}`).join(", ")}</p>
      )}
      <button type="button" className="bouton bouton-principal" onClick={() => setValide(true)}>{t.valider}</button>
      {valide && <p className="aide" role="status">{t.valide}</p>}
    </section>
  );
}
