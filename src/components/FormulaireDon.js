"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MONTANT_MAX, MONTANT_MIN, montantsProposes, verifierDon } from "@/lib/regles-don";

// Erreurs vérifiées à chaque étape avant de passer à la suivante.
const champsParEtape = { 1: ["montant", "projet", "frequence"], 2: ["nom", "email", "prenom", "attestation"], 3: ["moyen", "conditions", "langue"] };
// Champ à atteindre au clavier pour chaque erreur.
const champDeErreur = { montant: "don-autre", nom: "don-nom", email: "don-email", conditions: "don-conditions" };

// Lit ?projet=, ?montant= et ?annule= dans le navigateur : la page reste statique (servie par le CDN).
// Seules les valeurs connues sont gardées.
export function FormulaireDonDepuisAdresse(props) {
  const recherche = useSearchParams();
  const projet = recherche.get("projet");
  const montant = recherche.get("montant") ?? "";
  return (
    <>
      {recherche.get("annule") === "1" && <p className="message message-info">{props.messageAnnule}</p>}
      <FormulaireDon
        {...props}
        projetInitial={Object.hasOwn(props.titresProjets, projet ?? "") ? projet : ""}
        montantInitial={/^\d{1,5}$/.test(montant) ? Number(montant) : null}
      />
    </>
  );
}

export default function FormulaireDon({ t, exemple, titresProjets, langue, liens, projetInitial = "", montantInitial = null }) {
  const proposeInitial = montantsProposes.ponctuel.includes(montantInitial);
  const [etape, setEtape] = useState(1);
  const [don, setDon] = useState({
    frequence: "ponctuel",
    montant: montantInitial && proposeInitial ? montantInitial : 50,
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
  const titreEtape = useRef(null);
  const etapeAffichee = useRef(1);

  // Changement d'étape : le focus va sur le titre de la nouvelle étape (lu par les lecteurs d'écran).
  useEffect(() => {
    if (etapeAffichee.current !== etape) titreEtape.current?.focus();
    etapeAffichee.current = etape;
  }, [etape]);

  // Erreur : le focus va sur le premier champ concerné.
  useEffect(() => {
    const id = erreurs.map((e) => champDeErreur[e]).find(Boolean);
    if (id) document.getElementById(id)?.focus();
  }, [erreurs]);

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
      const { autre, conditions, ...reste } = donComplet;
      const reponse = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reste, conditions }),
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

  function envoyer(e) {
    e.preventDefault();
    if (etape < 3) suivant();
    else confirmer();
  }

  const texteErreur = (champ) => (t.erreurs[champ] ?? t.erreurs.autre).replace("{min}", MONTANT_MIN).replace("{max}", MONTANT_MAX);
  const enErreur = (champ) => erreurs.includes(champ);
  // Attributs d'un champ : signalé invalide et relié à son message.
  const aria = (champ) => (enErreur(champ) ? { "aria-invalid": true, "aria-describedby": `erreur-${champ}` } : {});
  const messageErreur = (champ) =>
    enErreur(champ) && (
      <p className="erreur-champ" id={`erreur-${champ}`} role="alert">{texteErreur(champ)}</p>
    );
  // Erreurs sans champ à l'écran (cas rares) : un message général, pour ne jamais bloquer sans explication.
  const autres = erreurs.filter((e) => !champDeErreur[e]);

  const contexte = don.autre === "" ? t.contextes[don.frequence][don.montant] : t.contexteAutre;
  const titre = (texte) => <legend ref={titreEtape} tabIndex={-1}>{texte}</legend>;

  // « J'accepte les {conditions} et la {confidentialite}. » : les deux textes sont des liens.
  const phraseConditions = t.conditions.split(/(\{conditions\}|\{confidentialite\})/).map((morceau, k) => {
    if (morceau === "{conditions}") return <a key={k} href={liens.conditions} target="_blank" rel="noopener">{t.lienConditions}</a>;
    if (morceau === "{confidentialite}") return <a key={k} href={liens.confidentialite} target="_blank" rel="noopener">{t.lienConfidentialite}</a>;
    return morceau;
  });

  return (
    <form className="formulaire-don" onSubmit={envoyer} noValidate>
      <p className="etape-indicateur">{t.etape.replace("{n}", etape)}</p>
      <div className="etape-barre" aria-hidden="true">
        <span style={{ width: `${(etape / 3) * 100}%` }} />
      </div>

      {etape === 1 && (
        <fieldset>
          {titre(t.frequenceTitre)}
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
              id="don-autre"
              type="number"
              inputMode="numeric"
              min={MONTANT_MIN}
              max={MONTANT_MAX}
              step="1"
              value={don.autre}
              onChange={(e) => maj("autre", e.target.value)}
              {...aria("montant")}
            />
          </label>
          {messageErreur("montant")}

          <label className="champ">
            {t.projetTitre}
            <select value={don.projet} onChange={(e) => maj("projet", e.target.value)}>
              <option value="">{t.projetGeneral}</option>
              {Object.entries(titresProjets).map(([id, titreProjet]) => (
                <option key={id} value={id}>
                  {titreProjet}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      {etape === 2 && (
        <fieldset>
          {titre(t.infosTitre)}
          <div className="champs-deux">
            <label className="champ">
              {t.prenom}
              <input autoComplete="given-name" maxLength={100} value={don.prenom} onChange={(e) => maj("prenom", e.target.value)} />
            </label>
            <div>
              <label className="champ">
                {t.nom} <span className="obligatoire">({t.obligatoire})</span>
                <input id="don-nom" autoComplete="family-name" maxLength={100} required value={don.nom} onChange={(e) => maj("nom", e.target.value)} {...aria("nom")} />
              </label>
              {messageErreur("nom")}
            </div>
          </div>
          <label className="champ">
            {t.email} <span className="obligatoire">({t.obligatoire})</span>
            <input id="don-email" type="email" autoComplete="email" maxLength={254} required value={don.email} onChange={(e) => maj("email", e.target.value)} {...aria("email")} />
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
          {titre(t.paiementTitre)}
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
            <input id="don-conditions" type="checkbox" checked={don.conditions} onChange={(e) => maj("conditions", e.target.checked)} {...aria("conditions")} />
            <span>{phraseConditions} <span className="obligatoire">({t.obligatoire})</span></span>
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

      {autres.length > 0 && <p className="message message-erreur" role="alert">{t.erreurs.autre}</p>}

      <div className="actions-don">
        {etape > 1 && (
          <button type="button" className="bouton bouton-contour" onClick={() => { setErreurs([]); setEtape(etape - 1); }}>
            {t.precedent}
          </button>
        )}
        <button type="submit" className="bouton bouton-principal" disabled={envoi}>
          {etape < 3 ? t.suivant : envoi ? t.envoi : t.confirmer}
        </button>
      </div>
    </form>
  );
}
