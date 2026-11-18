"use client";

import { useMemo, useState } from "react";
import {
  agreger, matriceDepuisComparaisons, poidsVecteurPropre, ratioCoherence, scoresTaches,
  valeurDepuisCurseur, SEUIL_COHERENCE,
} from "@/lib/ahp";

export const CLE_POIDS_AHP = "cb3-poids-ahp";
const MIN_CRITERES = 2;
const MAX_CRITERES = 10;
const MAX_VOTANTS = 50;

// Matrice de comparaisons d'un votant à partir de ses curseurs.
function matriceDuVote(criteres, curseurs) {
  const comparaisons = {};
  criteres.forEach((a, i) => {
    comparaisons[i] = {};
    criteres.forEach((b, j) => {
      if (j > i) comparaisons[i][j] = valeurDepuisCurseur(curseurs[`${a.id}-${b.id}`] ?? 0);
    });
  });
  return matriceDepuisComparaisons(criteres.length, comparaisons);
}

// Écran AHP : critères, comparaisons deux à deux (échelle de Saaty), poids et cohérence, notes des tâches.
// Vote du COVIDEBA (décision de Roy, 19/11/2026) : sur un seul appareil, chaque votant compare les critères à son tour.
// Les votes sont anonymes : seules leurs matrices sont gardées, en mémoire, jamais affichées une par une.
// Les poids sont recalculés après chaque vote, par moyenne géométrique des matrices (agreger, comme module_ahp/ahp.py).
export default function OutilAhp({ t, langue, taches, nomCritere }) {
  const [criteres, setCriteres] = useState(() => [1, 2, 3].map((k) => ({ id: k, nom: `${nomCritere} ${k}` })));
  // curseurs[`${a}-${b}`] : de -8 à 8 ; positif = le critère a compte plus que b.
  const [curseurs, setCurseurs] = useState({});
  const [nbVotants, setNbVotants] = useState(1);
  const [votes, setVotes] = useState([]); // matrices des votes enregistrés
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState("");

  const n = criteres.length;
  const paires = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) paires.push([criteres[i], criteres[j]]);
  const cle = (a, b) => `${a.id}-${b.id}`;

  const voteEnCours = useMemo(() => matriceDuVote(criteres, curseurs), [criteres, curseurs]);
  const crVote = ratioCoherence(voteEnCours);
  // Avant le premier vote enregistré, le résultat montre le vote en cours (aperçu).
  const { poids, cr } = useMemo(() => {
    const A = votes.length > 0 ? agreger(votes) : voteEnCours;
    return { poids: poidsVecteurPropre(A).poids, cr: ratioCoherence(A) };
  }, [votes, voteEnCours]);
  const voteCommence = votes.length > 0;
  const voteTermine = votes.length >= nbVotants;

  const note = (tacheId, critereId) => notes[`${tacheId}-${critereId}`] ?? 5;
  const poidsTaches = scoresTaches(poids, taches.map((tache) => criteres.map((c) => note(tache.id, c.id))));
  const coherent = cr <= SEUIL_COHERENCE;
  const pourcent = (x) => new Intl.NumberFormat(langue, { style: "percent", maximumFractionDigits: 1 }).format(x);
  const nombre = (x, d = 2) => new Intl.NumberFormat(langue, { maximumFractionDigits: d, minimumFractionDigits: d }).format(x);

  function phrase(a, b, c) {
    if (c === 0) return t.egal;
    const [fort, faible] = c > 0 ? [a, b] : [b, a];
    // Valeur de Saaty : 2 un peu, 3 modérément, 4-5 nettement, 6-7 beaucoup, 8-9 extrêmement.
    const v = Math.abs(c) + 1;
    const niveau = t.niveaux[String(v <= 2 ? 1 : v <= 3 ? 2 : v <= 5 ? 3 : v <= 7 ? 4 : 5)];
    return t.phrase.replace("{a}", fort.nom || "?").replace("{b}", faible.nom || "?").replace("{niveau}", niveau);
  }

  function ajouterCritere() {
    const id = Math.max(0, ...criteres.map((c) => c.id)) + 1;
    setCriteres([...criteres, { id, nom: `${nomCritere} ${id}` }]);
    setMessage("");
  }

  function enregistrerVote() {
    if (crVote > SEUIL_COHERENCE) return setMessage(t.voteIncoherent);
    setVotes([...votes, voteEnCours]);
    setCurseurs({}); // le votant suivant part du centre et ne voit pas le vote précédent
    setMessage("");
  }

  function recommencerVote() {
    setVotes([]);
    setCurseurs({});
    setMessage("");
  }

  function enregistrer() {
    if (!voteTermine) return setMessage(t.attendreVotes);
    if (!coherent) return setMessage(t.bloque);
    const valeurs = Object.fromEntries(taches.map((tache, i) => [tache.id, Math.round(poidsTaches[i] * 100) / 100]));
    try {
      localStorage.setItem(CLE_POIDS_AHP, JSON.stringify(valeurs));
      setMessage(t.enregistre);
    } catch {
      setMessage(t.erreurStockage);
    }
  }

  return (
    <div className="outil-ahp">
      <section>
        <h2>{t.criteresTitre}</h2>
        <p className="aide">{t.criteresAide}</p>
        <ul className="liste-criteres">
          {criteres.map((c) => (
            <li key={c.id}>
              <input
                aria-label={t.critere}
                value={c.nom}
                maxLength={60}
                disabled={voteCommence}
                onChange={(e) => setCriteres(criteres.map((x) => (x.id === c.id ? { ...x, nom: e.target.value } : x)))}
              />
              <button type="button" className="bouton-texte" disabled={voteCommence || n <= MIN_CRITERES} onClick={() => setCriteres(criteres.filter((x) => x.id !== c.id))}>
                {t.supprimer}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="bouton bouton-contour bouton-sombre" disabled={voteCommence || n >= MAX_CRITERES} onClick={ajouterCritere}>
          {t.ajouterCritere}
        </button>
        {voteCommence && <p className="aide">{t.criteresVerrouilles}</p>}
      </section>

      <section>
        <h2>{t.comparaisonsTitre}</h2>
        <label className="champ champ-court">
          {t.nbVotants}
          <input
            type="number" min="1" max={MAX_VOTANTS} step="1"
            value={nbVotants}
            disabled={voteCommence}
            onChange={(e) => setNbVotants(Math.min(MAX_VOTANTS, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
          />
        </label>
        <p className="aide">{t.votantsAide}</p>
        {voteTermine ? (
          <p className="message message-info" role="status">{t.votesTermines.replace("{n}", nbVotants)}</p>
        ) : (
          <>
        <h3 className="vote-numero">{t.voteNumero.replace("{k}", votes.length + 1).replace("{n}", nbVotants)}</h3>
        <p className="aide">{t.comparaisonsAide}</p>
        <ul className="liste-paires">
          {paires.map(([a, b]) => {
            const c = curseurs[cle(a, b)] ?? 0;
            return (
              <li key={cle(a, b)}>
                <div className="paire-noms">
                  <span>{a.nom}</span>
                  <span>{b.nom}</span>
                </div>
                {/* Curseur : à gauche le premier critère compte plus, à droite le second. */}
                <input
                  type="range"
                  min={-8}
                  max={8}
                  step={1}
                  value={-c}
                  aria-label={`${a.nom} / ${b.nom}`}
                  aria-valuetext={phrase(a, b, c)}
                  onChange={(e) => setCurseurs({ ...curseurs, [cle(a, b)]: -Number(e.target.value) })}
                />
                <p className="paire-phrase">{phrase(a, b, c)}</p>
              </li>
            );
          })}
        </ul>
        <button type="button" className="bouton bouton-principal" onClick={enregistrerVote}>{t.enregistrerVote}</button>
        {message === t.voteIncoherent && <p className="message message-erreur" role="alert">{message}</p>}
          </>
        )}
        {voteCommence && (
          <button type="button" className="bouton-texte" onClick={recommencerVote}>{t.recommencerVote}</button>
        )}
      </section>

      <section>
        <h2>{t.resultatTitre}</h2>
        <p className="aide">
          {voteCommence ? t.resultatVotes.replace("{k}", votes.length).replace("{n}", nbVotants) : t.resultatApercu}
        </p>
        <ul className="poids-criteres">
          {criteres.map((c, i) => (
            <li key={c.id}>
              <span>{c.nom}</span>
              <span className="barre-poids"><span style={{ width: `${poids[i] * 100}%` }} /></span>
              <b>{pourcent(poids[i])}</b>
            </li>
          ))}
        </ul>
        <p className={coherent ? "message message-info" : "message message-erreur"} role="status">
          {n <= 2 ? t.deuxCriteres : coherent ? t.coherent : t.incoherent}
        </p>
      </section>

      <section>
        <h2>{t.notesTitre}</h2>
        <p className="aide">{t.notesAide}</p>
        <div className="tableau-defilant">
          <table className="tableau tableau-saisie">
            <thead>
              <tr>
                <th scope="col">{t.tache}</th>
                {criteres.map((c) => <th key={c.id} scope="col">{c.nom}</th>)}
                <th scope="col" className="nombre">{t.poidsTache}</th>
              </tr>
            </thead>
            <tbody>
              {taches.map((tache, i) => (
                <tr key={tache.id}>
                  <td>{tache.libelle}</td>
                  {criteres.map((c) => (
                    <td key={c.id}>
                      <input
                        type="number" min="0" max="10" step="1"
                        aria-label={`${tache.libelle} : ${c.nom}`}
                        value={note(tache.id, c.id)}
                        onChange={(e) => {
                          const v = Math.min(10, Math.max(0, Number(e.target.value) || 0));
                          setNotes({ ...notes, [`${tache.id}-${c.id}`]: v });
                          setMessage("");
                        }}
                      />
                    </td>
                  ))}
                  <td className="nombre"><b>{nombre(poidsTaches[i])}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="bouton bouton-principal" onClick={enregistrer}>{t.enregistrer}</button>
        <p className="aide">{t.methode}</p>
        {message && message !== t.voteIncoherent && <p className={message === t.enregistre ? "message message-info" : "message message-erreur"} role="status">{message}</p>}
      </section>
    </div>
  );
}
