"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MONTANT_MAX,
  MONTANT_MIN,
  TAILLE_MAX_RECU,
  TYPES_RECU_AUTORISES,
  montantsProposes,
  moyensDepot,
  verifierDon,
} from "@/lib/regles-don";
import { formatEuroArrondi, formatEuroExact, formatFcfa } from "@/lib/monnaie";
import { covidebaComptes } from "@/donnees/covideba";

const champsParEtape = {
  1: ["montant", "projet"],
  2: ["nom", "email", "telephone", "prenom", "pays", "attestation"],
  3: ["moyen", "referenceRecu", "conditions", "langue"],
};
const champDeErreur = {
  montant: "don-autre",
  nom: "don-nom",
  email: "don-email",
  telephone: "don-telephone",
  pays: "don-pays",
  referenceRecu: "don-reference",
  conditions: "don-conditions",
};

export function FormulaireDonDepuisAdresse(props) {
  const recherche = useSearchParams();
  const projet = recherche.get("projet");
  const montant = recherche.get("montant") ?? "";
  return (
    <FormulaireDon
      {...props}
      projetInitial={Object.hasOwn(props.titresProjets, projet ?? "") ? projet : ""}
      montantInitial={/^\d{1,9}$/.test(montant) ? Number(montant) : null}
    />
  );
}

export default function FormulaireDon({ t, exemple, titresProjets, langue, liens, comptes = covidebaComptes, projetInitial = "", montantInitial = null }) {
  const router = useRouter();
  const proposeInitial = montantsProposes.ponctuel.includes(montantInitial);
  const [etape, setEtape] = useState(1);
  const [don, setDon] = useState({
    frequence: "ponctuel",
    montant: montantInitial && proposeInitial ? montantInitial : 25000,
    autre: montantInitial && !proposeInitial ? String(montantInitial) : "",
    projet: projetInitial,
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    pays: "",
    attestation: false,
    conditions: false,
    moyen: "virement",
    referenceRecu: "",
  });
  const [fichierRecu, setFichierRecu] = useState(null);
  const [erreurFichier, setErreurFichier] = useState("");
  const [erreurs, setErreurs] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreurServeur, setErreurServeur] = useState("");
  const titreEtape = useRef(null);
  const etapeAffichee = useRef(1);

  useEffect(() => {
    if (etapeAffichee.current !== etape) titreEtape.current?.focus();
    etapeAffichee.current = etape;
  }, [etape]);

  useEffect(() => {
    const id = erreurs.map((e) => champDeErreur[e]).find(Boolean);
    if (id) document.getElementById(id)?.focus();
  }, [erreurs]);

  const maj = (champ, valeur) => setDon((d) => ({ ...d, [champ]: valeur }));
  const montant = don.autre !== "" ? Number(don.autre) : don.montant;
  const donComplet = { ...don, montant, langue };
  const format = (n) => formatFcfa(langue, n);
  const euro = (n) => <small className="montant-euro">({formatEuroArrondi(langue, n)})</small>;

  function erreursEtape(n) {
    return verifierDon(donComplet).filter((e) => champsParEtape[n].includes(e));
  }

  function suivant() {
    const e = erreursEtape(etape);
    setErreurs(e);
    if (e.length === 0) setEtape(etape + 1);
  }

  function changerFichier(file) {
    setErreurFichier("");
    if (!file) {
      setFichierRecu(null);
      return;
    }
    if (!TYPES_RECU_AUTORISES.includes(file.type)) {
      setFichierRecu(null);
      setErreurFichier(t.erreurs.recuType);
      return;
    }
    if (file.size > TAILLE_MAX_RECU) {
      setFichierRecu(null);
      setErreurFichier(t.erreurs.recuTaille);
      return;
    }
    setFichierRecu(file);
  }

  async function confirmer() {
    const e = erreursEtape(3);
    setErreurs(e);
    if (!fichierRecu) {
      setErreurFichier(t.erreurs.recuObligatoire);
      document.getElementById("don-recu")?.focus();
      return;
    }
    if (e.length > 0) return;

    setEnvoi(true);
    setErreurServeur("");
    try {
      const formData = new FormData();
      formData.append("montant_fcfa", String(montant));
      formData.append("moyen", don.moyen);
      formData.append("receipt_reference", don.referenceRecu.trim());
      formData.append("nom", don.nom.trim());
      formData.append("prenom", don.prenom.trim());
      formData.append("email", don.email.trim());
      formData.append("telephone", don.telephone.trim());
      formData.append("pays", don.pays);
      formData.append("attestation", String(don.attestation === true && don.pays === "BE"));
      formData.append("conditions", String(don.conditions === true));
      formData.append("langue", langue);
      formData.append("projet", don.projet || "");
      formData.append("receipt_file", fichierRecu);

      const reponse = await fetch("/api/don", {
        method: "POST",
        body: formData,
      });
      const resultat = await reponse.json();
      if (reponse.ok && resultat.ok) {
        const ref = encodeURIComponent(resultat.receipt_reference || don.referenceRecu.trim());
        router.push(`/${langue}/don/merci?ref=${ref}`);
        return;
      }
      setErreurServeur(resultat.erreur === "nonActive" ? t.erreurs.nonConfigure : resultat.detail || t.erreurs.serveur);
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

  const texteErreur = (champ) => (t.erreurs[champ] ?? t.erreurs.autre).replace("{min}", format(MONTANT_MIN));
  const enErreur = (champ) => erreurs.includes(champ);
  const aria = (champ) => (enErreur(champ) ? { "aria-invalid": true, "aria-describedby": `erreur-${champ}` } : {});
  const messageErreur = (champ) =>
    enErreur(champ) && (
      <p className="erreur-champ" id={`erreur-${champ}`} role="alert">{texteErreur(champ)}</p>
    );
  const autres = erreurs.filter((e) => !champDeErreur[e]);

  const contexte = don.autre === "" ? t.contextes.ponctuel[don.montant] : t.contexteAutre;
  const titre = (texte) => <legend ref={titreEtape} tabIndex={-1}>{texte}</legend>;

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
          {titre(t.montantTitre)}
          <div className="choix-montant">
            {montantsProposes.ponctuel.map((m) => (
              <button
                key={m}
                type="button"
                className={don.autre === "" && don.montant === m ? "actif" : ""}
                aria-pressed={don.autre === "" && don.montant === m}
                onClick={() => setDon((d) => ({ ...d, montant: m, autre: "" }))}
              >
                {format(m)} {euro(m)}
              </button>
            ))}
          </div>
          <p className="contexte-montant" aria-live="polite">
            {don.autre === "" && <><strong>{format(don.montant)}</strong> {euro(don.montant)} </>}
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
                <span>{t.nom} <span className="obligatoire">({t.obligatoire})</span></span>
                <input id="don-nom" autoComplete="family-name" maxLength={100} required value={don.nom} onChange={(e) => maj("nom", e.target.value)} {...aria("nom")} />
              </label>
              {messageErreur("nom")}
            </div>
          </div>
          <div className="champs-deux">
            <div>
              <label className="champ">
                {t.email}
                <input id="don-email" type="email" autoComplete="email" maxLength={254} value={don.email} onChange={(e) => maj("email", e.target.value)} {...aria("email")} />
              </label>
              {messageErreur("email")}
            </div>
            <div>
              <label className="champ">
                {t.telephone}
                <input id="don-telephone" type="tel" autoComplete="tel" maxLength={32} value={don.telephone} onChange={(e) => maj("telephone", e.target.value)} {...aria("telephone")} />
              </label>
              {messageErreur("telephone")}
            </div>
          </div>
          <p className="aide">{t.contactAide}</p>
          <label className="champ">
            <span>{t.pays} <span className="obligatoire">({t.obligatoire})</span></span>
            <select
              id="don-pays"
              value={don.pays}
              onChange={(e) => setDon((d) => ({ ...d, pays: e.target.value, attestation: e.target.value === "BE" && d.attestation }))}
              {...aria("pays")}
            >
              <option value="">{t.paysChoisir}</option>
              <option value="BE">{t.paysBelgique}</option>
              <option value="autre">{t.paysAutre}</option>
            </select>
          </label>
          {messageErreur("pays")}
          {don.pays === "BE" && (
            <label className="case">
              <input type="checkbox" checked={don.attestation} onChange={(e) => maj("attestation", e.target.checked)} />
              {t.attestation}
            </label>
          )}
          {don.attestation && <p className="aide">{t.attestationAide}</p>}
        </fieldset>
      )}

      {etape === 3 && (
        <fieldset>
          {titre(t.paiementTitre)}
          <div className="recapitulatif">
            <strong>{t.recapitulatif}</strong>
            <p>
              {format(montant)} · {don.projet ? titresProjets[don.projet] : t.projetGeneral}
            </p>
            <p className="aide">{t.preleve.replace("{euros}", formatEuroExact(langue, montant))}</p>
          </div>

          <div className="comptes-covideba">
            <h3>{t.comptesTitre}</h3>
            <p className="aide">{t.comptesIntro}</p>
            <dl>
              {comptes.titulaire && <div><dt>{t.compteTitulaire}</dt><dd>{comptes.titulaire}</dd></div>}
              {comptes.banque && <div><dt>{t.compteBanque}</dt><dd>{comptes.banque}</dd></div>}
              {comptes.compteBancaire && <div><dt>{t.compteNumero}</dt><dd><code>{comptes.compteBancaire}</code></dd></div>}
              {comptes.mtnMomo && <div><dt>{t.compteMtn}</dt><dd><code>{comptes.mtnMomo}</code></dd></div>}
              {comptes.orangeMoney && <div><dt>{t.compteOrange}</dt><dd><code>{comptes.orangeMoney}</code></dd></div>}
              {comptes.adressePostale && <div><dt>Adresse</dt><dd>{comptes.adressePostale}</dd></div>}
              {comptes.autresInfos && <div><dt>Note</dt><dd>{comptes.autresInfos}</dd></div>}
            </dl>
          </div>

          <div className="choix-moyen">
            {moyensDepot.map((m) => (
              <label key={m} className={`option-moyen ${don.moyen === m ? "actif" : ""}`}>
                <input type="radio" name="moyen" value={m} checked={don.moyen === m} onChange={() => maj("moyen", m)} />
                {t[m]}
              </label>
            ))}
          </div>

          <label className="champ">
            <span>{t.referenceRecu} <span className="obligatoire">({t.obligatoire})</span></span>
            <input
              id="don-reference"
              maxLength={120}
              required
              placeholder={t.referencePlaceholder}
              value={don.referenceRecu}
              onChange={(e) => maj("referenceRecu", e.target.value)}
              {...aria("referenceRecu")}
            />
          </label>
          {messageErreur("referenceRecu")}

          <label className="champ champ-fichier">
            <span>{t.fichierRecu} <span className="obligatoire">({t.obligatoire})</span></span>
            <input
              id="don-recu"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => changerFichier(e.target.files?.[0] ?? null)}
            />
            <small className="aide">{t.fichierRecuAide}</small>
          </label>
          {erreurFichier && <p className="erreur-champ" role="alert">{erreurFichier}</p>}

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
