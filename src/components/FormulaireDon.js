"use client";

import { useState } from "react";
import { MONTANT_MAX, MONTANT_MIN, montantsProposes, verifierDon } from "@/lib/regles-don";

// Erreurs vérifiées à chaque étape avant de passer à la suivante.
const champsParEtape = { 1: ["montant", "projet"], 2: ["nom", "email", "prenom"], 3: ["moyen", "conditions"] };

export default function FormulaireDon({ t, exemple, titresProjets, langue, projetInitial, montantInitial }) {
  const proposeInitial = montantsProposes.ponctuel.includes(montantInitial);
  const [etape, setEtape] = useState(1);
  const [don, setDon] = useState({
    frequence: "ponctuel",
    montant: montantInitial ?? 50,
    autre: montantInitial && !proposeInitial ? String(montantInitial) : "",
    projet: projetInitial,
    prenom: "",
    nom: "",
    email: "",
    attestation: false,
    conditions: false,
    moyen: "bancontact",
  });
  const [erreurs, setErreurs] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreurServeur, setErreurServeur] = useState("");

  const maj = (champ, valeur) => setDon((d) => ({ ...d, [champ]: valeur }));
  const montant = don.autre !== "" ? Number(don.autre) : don.montant;
  const donComplet = { ...don, montant, langue };
  const format = (n) =>
    new Intl.NumberFormat(langue, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  function changerFrequence(f) {
    setDon((d) => ({
      ...d,
      frequence: f,
      montant: montantsProposes[f][1],
      autre: "",
      moyen: f === "mensuel" ? "carte" : d.moyen,
    }));
  }

  function erreursEtape(n) {
    return verifierDon(donComplet).filter((e) => champsParEtape[n].includes(e));
  }

  function suivant() {
    const e = erreursEtape(etape);
    setErreurs(e);
    if (e.length === 0) setEtape(etape + 1);
  }

  async function confirmer() {
    const e = erreursEtape(3);
    setErreurs(e);
    if (e.length > 0) return;
    setEnvoi(true);
    setErreurServeur("");
    try {
      const { autre, ...corps } = donComplet;
      const reponse = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      const resultat = await reponse.json();
      // On ne suit que les adresses de paiement de Stripe.
      if (reponse.ok && resultat.url?.startsWith("https://checkout.stripe.com/")) {
        window.location.assign(resultat.url);
        return;
      }
      setErreurServeur(resultat.erreur === "nonConfigure" ? t.erreurs.nonConfigure : t.erreurs.serveur);
    } catch {
      setErreurServeur(t.erreurs.serveur);
    }
    setEnvoi(false);
  }

  const messageErreur = (champ) =>
    erreurs.includes(champ) && (
      <p className="erreur-champ" role="alert">
        {t.erreurs[champ].replace("{min}", MONTANT_MIN).replace("{max}", MONTANT_MAX)}
      </p>
    );

  const contexte =
    don.autre === "" ? t.contextes[don.frequence][don.montant] : t.contexteAutre;

  return (
    <div className="formulaire-don">
      <p className="etape-indicateur">{t.etape.replace("{n}", etape)}</p>
      <div className="etape-barre" aria-hidden="true">
        <span style={{ width: `${(etape / 3) * 100}%` }} />
      </div>

      {etape === 1 && (
        <fieldset>
          <legend>{t.frequenceTitre}</legend>
          <div className="choix-frequence">
            {["ponctuel", "mensuel"].map((f) => (
              <button
                key={f}
                type="button"
                className={don.frequence === f ? "actif" : ""}
                aria-pressed={don.frequence === f}
                onClick={() => changerFrequence(f)}
              >
                {t[f]}
              </button>
            ))}
          </div>

          <h2>{t.montantTitre}</h2>
          <div className="choix-montant">
            {montantsProposes[don.frequence].map((m) => (
              <button
                key={m}
                type="button"
                className={don.autre === "" && don.montant === m ? "actif" : ""}
                aria-pressed={don.autre === "" && don.montant === m}
                onClick={() => setDon((d) => ({ ...d, montant: m, autre: "" }))}
              >
                {format(m)}
                {don.frequence === "mensuel" && <small> {t.parMois}</small>}
              </button>
            ))}
          </div>
          <p className="contexte-montant" aria-live="polite">
            {don.autre === "" && <strong>{format(don.montant)} </strong>}
            {contexte} <span className="note-exemple">({exemple})</span>
          </p>

          <label className="champ">
            {t.autreMontant}
            <input
              type="number"
              inputMode="numeric"
              min={MONTANT_MIN}
              max={MONTANT_MAX}
              step="1"
              value={don.autre}
              onChange={(e) => maj("autre", e.target.value)}
            />
          </label>
          {messageErreur("montant")}

          <label className="champ">
            {t.projetTitre}
            <select value={don.projet} onChange={(e) => maj("projet", e.target.value)}>
              <option value="">{t.projetGeneral}</option>
              {Object.entries(titresProjets).map(([id, titre]) => (
                <option key={id} value={id}>
                  {titre}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      {etape === 2 && (
        <fieldset>
          <legend>{t.infosTitre}</legend>
          <div className="champs-deux">
            <label className="champ">
              {t.prenom}
              <input autoComplete="given-name" maxLength={100} value={don.prenom} onChange={(e) => maj("prenom", e.target.value)} />
            </label>
            <label className="champ">
              {t.nom} <span className="obligatoire">({t.obligatoire})</span>
              <input autoComplete="family-name" maxLength={100} required value={don.nom} onChange={(e) => maj("nom", e.target.value)} />
            </label>
          </div>
          {messageErreur("nom")}
          <label className="champ">
            {t.email} <span className="obligatoire">({t.obligatoire})</span>
            <input type="email" autoComplete="email" maxLength={254} required value={don.email} onChange={(e) => maj("email", e.target.value)} />
          </label>
          {messageErreur("email")}
          <label className="case">
            <input type="checkbox" checked={don.attestation} onChange={(e) => maj("attestation", e.target.checked)} />
            {t.attestation}
          </label>
          {don.attestation && <p className="aide">{t.attestationAide}</p>}
        </fieldset>
      )}

      {etape === 3 && (
        <fieldset>
          <legend>{t.paiementTitre}</legend>
          <div className="recapitulatif">
            <strong>{t.recapitulatif}</strong>
            <p>
              {format(montant)}
              {don.frequence === "mensuel" ? ` ${t.parMois}` : ""} ·{" "}
              {don.projet ? titresProjets[don.projet] : t.projetGeneral}
            </p>
          </div>
          <div className="choix-moyen">
            {(don.frequence === "mensuel" ? ["carte"] : ["bancontact", "carte"]).map((m) => (
              <label key={m} className={`option-moyen ${don.moyen === m ? "actif" : ""}`}>
                <input type="radio" name="moyen" value={m} checked={don.moyen === m} onChange={() => maj("moyen", m)} />
                {t[m]}
              </label>
            ))}
          </div>
          {don.frequence === "mensuel" && <p className="aide">{t.mensuelCarte}</p>}
          <label className="case">
            <input type="checkbox" checked={don.conditions} onChange={(e) => maj("conditions", e.target.checked)} />
            {t.conditions} <span className="obligatoire">({t.obligatoire})</span>
          </label>
          {messageErreur("conditions")}
          <p className="aide aide-securite">{t.securite}</p>
          {erreurServeur && (
            <p className="message message-erreur" role="alert">
              {erreurServeur}
            </p>
          )}
        </fieldset>
      )}

      <div className="actions-don">
        {etape > 1 && (
          <button type="button" className="bouton bouton-contour" onClick={() => { setErreurs([]); setEtape(etape - 1); }}>
            {t.precedent}
          </button>
        )}
        {etape < 3 ? (
          <button type="button" className="bouton bouton-principal" onClick={suivant}>
            {t.suivant}
          </button>
        ) : (
          <button type="button" className="bouton bouton-principal" disabled={envoi} onClick={confirmer}>
            {envoi ? t.envoi : t.confirmer}
          </button>
        )}
      </div>
    </div>
  );
}
