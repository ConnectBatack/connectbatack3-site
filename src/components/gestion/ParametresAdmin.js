"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES_EQUIPE = [
  { id: "admin", label: "Administrateur" },
  { id: "tresorier", label: "Trésorier" },
  { id: "membre", label: "Membre" },
  { id: "encadrant", label: "Encadrant (lecture)" },
];

function BanniereEtat({ etat }) {
  if (!etat?.texte) return null;
  const cls = etat.type === "erreur" ? "message message-erreur" : "message";
  return (
    <p className={cls} role={etat.type === "erreur" ? "alert" : "status"}>
      {etat.texte}
    </p>
  );
}

async function envoyerJson(url, method, payload) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Une erreur est survenue.");
  }
  return data;
}

export default function ParametresAdmin({ t, lang, session, orgInitiale, utilisateursInitiaux }) {
  const router = useRouter();
  const estAdmin = session.role === "admin";

  const [onglet, setOnglet] = useState(
    !session.mustChangePassword && estAdmin ? "org" : "profil",
  );

  const [profil, setProfil] = useState({
    full_name: session.nom || "",
    email: session.email || "",
    phone: session.telephone || "",
  });
  const [etatProfil, setEtatProfil] = useState(null);
  const [envoiProfil, setEnvoiProfil] = useState(false);

  const [mdp, setMdp] = useState({ current_password: "", new_password: "", confirm: "" });
  const [etatMdp, setEtatMdp] = useState(null);
  const [envoiMdp, setEnvoiMdp] = useState(false);

  const [org, setOrg] = useState({
    covideba_email: orgInitiale?.covideba_email || "",
    covideba_phone: orgInitiale?.covideba_phone || "",
    bank_holder: orgInitiale?.bank_holder || "",
    bank_name: orgInitiale?.bank_name || "",
    bank_account: orgInitiale?.bank_account || "",
    mobile_money_mtn: orgInitiale?.mobile_money_mtn || "",
    mobile_money_orange: orgInitiale?.mobile_money_orange || "",
    postal_address: orgInitiale?.postal_address || "",
    other_info: orgInitiale?.other_info || "",
  });
  const [etatOrg, setEtatOrg] = useState(null);
  const [envoiOrg, setEnvoiOrg] = useState(false);

  const [utilisateurs, setUtilisateurs] = useState(utilisateursInitiaux || []);
  const [etatUsers, setEtatUsers] = useState(null);
  const [nouveau, setNouveau] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "membre",
    password: "",
  });

  async function enregistrerProfil(e) {
    e.preventDefault();
    setEtatProfil(null);
    setEnvoiProfil(true);
    try {
      await envoyerJson("/api/auth/me", "PATCH", {
        full_name: profil.full_name.trim(),
        email: profil.email.trim(),
        phone: profil.phone.trim(),
      });
      setEtatProfil({ type: "ok", texte: t.profilEnregistre });
      router.refresh();
    } catch (err) {
      setEtatProfil({ type: "erreur", texte: err.message });
    } finally {
      setEnvoiProfil(false);
    }
  }

  async function enregistrerMotDePasse(e) {
    e.preventDefault();
    setEtatMdp(null);
    if (mdp.new_password !== mdp.confirm) {
      setEtatMdp({ type: "erreur", texte: t.mdpNonIdentiques });
      return;
    }
    setEnvoiMdp(true);
    try {
      await envoyerJson("/api/auth/change-password", "POST", {
        current_password: mdp.current_password,
        new_password: mdp.new_password,
      });
      setEtatMdp({ type: "ok", texte: t.mdpEnregistre });
      setMdp({ current_password: "", new_password: "", confirm: "" });
      setTimeout(() => {
        router.push(`/${lang}/connexion`);
        router.refresh();
      }, 900);
    } catch (err) {
      setEtatMdp({ type: "erreur", texte: err.message });
    } finally {
      setEnvoiMdp(false);
    }
  }

  async function enregistrerOrganisation(e) {
    e.preventDefault();
    setEtatOrg(null);
    setEnvoiOrg(true);
    try {
      const maj = await envoyerJson("/api/admin/settings", "PUT", org);
      setOrg({
        covideba_email: maj.covideba_email || "",
        covideba_phone: maj.covideba_phone || "",
        bank_holder: maj.bank_holder || "",
        bank_name: maj.bank_name || "",
        bank_account: maj.bank_account || "",
        mobile_money_mtn: maj.mobile_money_mtn || "",
        mobile_money_orange: maj.mobile_money_orange || "",
        postal_address: maj.postal_address || "",
        other_info: maj.other_info || "",
      });
      setEtatOrg({ type: "ok", texte: t.orgEnregistre });
      router.refresh();
    } catch (err) {
      setEtatOrg({ type: "erreur", texte: err.message });
    } finally {
      setEnvoiOrg(false);
    }
  }

  function majChampUtilisateur(id, champ, valeur) {
    setUtilisateurs((liste) => liste.map((u) => (u.id === id ? { ...u, [champ]: valeur } : u)));
  }

  async function enregistrerUtilisateur(u) {
    setEtatUsers(null);
    try {
      const maj = await envoyerJson(`/api/admin/users/${encodeURIComponent(u.id)}`, "PATCH", {
        full_name: u.full_name,
        email: u.email,
        phone: u.phone || "",
        role: u.role,
        is_active: u.is_active,
      });
      setUtilisateurs((liste) => liste.map((item) => (item.id === u.id ? maj : item)));
      setEtatUsers({ type: "ok", texte: t.membreEnregistre });
    } catch (err) {
      setEtatUsers({ type: "erreur", texte: err.message });
    }
  }

  async function creerUtilisateur(e) {
    e.preventDefault();
    setEtatUsers(null);
    try {
      const cree = await envoyerJson("/api/admin/users", "POST", {
        full_name: nouveau.full_name.trim(),
        email: nouveau.email.trim(),
        role: nouveau.role,
        password: nouveau.password,
        must_change_password: true,
      });
      if (nouveau.phone.trim()) {
        const avecTel = await envoyerJson(`/api/admin/users/${encodeURIComponent(cree.id)}`, "PATCH", {
          phone: nouveau.phone.trim(),
        });
        setUtilisateurs((liste) => [avecTel, ...liste]);
      } else {
        setUtilisateurs((liste) => [cree, ...liste]);
      }
      setNouveau({ full_name: "", email: "", phone: "", role: "membre", password: "" });
      setEtatUsers({ type: "ok", texte: t.membreCree });
    } catch (err) {
      setEtatUsers({ type: "erreur", texte: err.message });
    }
  }

  return (
    <div className="gestion-sections">
      {session.mustChangePassword && (
        <p className="avertissement" role="alert">
          {t.motDePasseObligatoire}
        </p>
      )}

      {!session.mustChangePassword && (
        <div className="admin-onglets-nav" role="tablist">
          {estAdmin && (
            <button
              type="button"
              className={`bouton ${onglet === "org" ? "bouton-principal" : "bouton-contour"}`}
              onClick={() => setOnglet("org")}
            >
              {t.ongletOrg}
            </button>
          )}
          <button
            type="button"
            className={`bouton ${onglet === "profil" ? "bouton-principal" : "bouton-contour"}`}
            onClick={() => setOnglet("profil")}
          >
            {t.ongletProfil}
          </button>
          {estAdmin && (
            <button
              type="button"
              className={`bouton ${onglet === "equipe" ? "bouton-principal" : "bouton-contour"}`}
              onClick={() => setOnglet("equipe")}
            >
              {t.ongletEquipe}
            </button>
          )}
        </div>
      )}

      {(onglet === "profil" || session.mustChangePassword) && (
        <>
          {!session.mustChangePassword && (
            <form className="gestion-carte" onSubmit={enregistrerProfil}>
              <h2>{t.profilTitre}</h2>
              <div className="gestion-grille-form">
                <label className="champ">
                  {t.nomComplet}
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={profil.full_name}
                    onChange={(e) => setProfil((p) => ({ ...p, full_name: e.target.value }))}
                  />
                </label>
                <label className="champ">
                  {t.email}
                  <input
                    type="email"
                    required
                    maxLength={254}
                    value={profil.email}
                    onChange={(e) => setProfil((p) => ({ ...p, email: e.target.value }))}
                  />
                </label>
                <label className="champ">
                  {t.telephone}
                  <input
                    type="tel"
                    maxLength={32}
                    placeholder="+237 6..."
                    value={profil.phone}
                    onChange={(e) => setProfil((p) => ({ ...p, phone: e.target.value }))}
                  />
                </label>
              </div>
              <BanniereEtat etat={etatProfil} />
              <div className="gestion-actions-carte">
                <button type="submit" className="bouton bouton-principal" disabled={envoiProfil}>
                  {envoiProfil ? "..." : t.enregistrer}
                </button>
              </div>
            </form>
          )}

          <form className="gestion-carte" onSubmit={enregistrerMotDePasse}>
            <h2>{t.mdpTitre}</h2>
            <div className="gestion-grille-form">
              <label className="champ">
                {t.mdpActuel}
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={mdp.current_password}
                  onChange={(e) => setMdp((m) => ({ ...m, current_password: e.target.value }))}
                />
              </label>
              <label className="champ">
                {t.mdpNouveau}
                <input
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  value={mdp.new_password}
                  onChange={(e) => setMdp((m) => ({ ...m, new_password: e.target.value }))}
                />
              </label>
              <label className="champ">
                {t.mdpConfirmer}
                <input
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  value={mdp.confirm}
                  onChange={(e) => setMdp((m) => ({ ...m, confirm: e.target.value }))}
                />
              </label>
            </div>
            <BanniereEtat etat={etatMdp} />
            <div className="gestion-actions-carte">
              <button type="submit" className="bouton bouton-principal" disabled={envoiMdp}>
                {envoiMdp ? "..." : t.enregistrer}
              </button>
            </div>
          </form>
        </>
      )}

      {estAdmin && !session.mustChangePassword && onglet === "org" && (
        <form className="gestion-carte" onSubmit={enregistrerOrganisation}>
          <h2>{t.orgTitre}</h2>
          <p className="aide">{t.orgAide}</p>

          <h3>{t.orgContactTitre}</h3>
          <div className="gestion-grille-form">
            <label className="champ">
              {t.orgEmail}
              <input
                type="email"
                required
                maxLength={254}
                value={org.covideba_email}
                onChange={(e) => setOrg((o) => ({ ...o, covideba_email: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.orgTel}
              <input
                type="tel"
                required
                maxLength={64}
                value={org.covideba_phone}
                onChange={(e) => setOrg((o) => ({ ...o, covideba_phone: e.target.value }))}
              />
            </label>
            <label className="champ champ-large">
              {t.adressePostale}
              <input
                maxLength={255}
                placeholder="Ex : Village Batack, Cameroun"
                value={org.postal_address}
                onChange={(e) => setOrg((o) => ({ ...o, postal_address: e.target.value }))}
              />
            </label>
          </div>

          <h3>{t.orgComptesTitre}</h3>
          <div className="gestion-grille-form">
            <label className="champ">
              {t.banqueTitulaire}
              <input
                required
                maxLength={160}
                value={org.bank_holder}
                onChange={(e) => setOrg((o) => ({ ...o, bank_holder: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.banqueNom}
              <input
                required
                maxLength={160}
                value={org.bank_name}
                onChange={(e) => setOrg((o) => ({ ...o, bank_name: e.target.value }))}
              />
            </label>
            <label className="champ champ-large">
              {t.banqueCompte}
              <input
                required
                maxLength={120}
                value={org.bank_account}
                onChange={(e) => setOrg((o) => ({ ...o, bank_account: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.mtnMomo}
              <input
                required
                maxLength={64}
                value={org.mobile_money_mtn}
                onChange={(e) => setOrg((o) => ({ ...o, mobile_money_mtn: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.orangeMoney}
              <input
                required
                maxLength={64}
                value={org.mobile_money_orange}
                onChange={(e) => setOrg((o) => ({ ...o, mobile_money_orange: e.target.value }))}
              />
            </label>
            <label className="champ champ-large">
              {t.autresInfos}
              <textarea
                rows={3}
                maxLength={1000}
                value={org.other_info}
                onChange={(e) => setOrg((o) => ({ ...o, other_info: e.target.value }))}
              />
            </label>
          </div>

          <div className="comptes-covideba">
            <h3>{t.apercuDonateurs}</h3>
            <dl>
              <div><dt>{t.orgTel}</dt><dd>{org.covideba_phone}</dd></div>
              <div><dt>{t.orgEmail}</dt><dd>{org.covideba_email}</dd></div>
              <div><dt>{t.banqueTitulaire}</dt><dd>{org.bank_holder} ({org.bank_name})</dd></div>
              <div><dt>{t.banqueCompte}</dt><dd><code>{org.bank_account}</code></dd></div>
              <div><dt>{t.mtnMomo}</dt><dd><code>{org.mobile_money_mtn}</code></dd></div>
              <div><dt>{t.orangeMoney}</dt><dd><code>{org.mobile_money_orange}</code></dd></div>
            </dl>
          </div>

          <BanniereEtat etat={etatOrg} />
          <div className="gestion-actions-carte">
            <button type="submit" className="bouton bouton-principal bouton-grand" disabled={envoiOrg}>
              {envoiOrg ? "..." : t.enregistrer}
            </button>
          </div>
        </form>
      )}

      {estAdmin && !session.mustChangePassword && onglet === "equipe" && (
        <section className="gestion-carte">
          <h2>{t.equipeTitre}</h2>
          <p className="aide">{t.equipeIntro}</p>
          <BanniereEtat etat={etatUsers} />

          <div className="admin-membres-grille">
            {utilisateurs.map((u) => (
              <div key={u.id} className="admin-membre-carte">
                <div className="admin-membre-entete">
                  <strong>{u.full_name}</strong>
                  <span className="admin-badge">{u.role}</span>
                </div>
                <label className="champ">
                  {t.nomComplet}
                  <input
                    value={u.full_name}
                    onChange={(e) => majChampUtilisateur(u.id, "full_name", e.target.value)}
                  />
                </label>
                <label className="champ">
                  {t.email}
                  <input
                    type="email"
                    value={u.email}
                    onChange={(e) => majChampUtilisateur(u.id, "email", e.target.value)}
                  />
                </label>
                <label className="champ">
                  {t.telephone}
                  <input
                    type="tel"
                    value={u.phone || ""}
                    onChange={(e) => majChampUtilisateur(u.id, "phone", e.target.value)}
                  />
                </label>
                <label className="champ">
                  {t.role}
                  <select
                    value={u.role}
                    disabled={u.id === session.id}
                    onChange={(e) => majChampUtilisateur(u.id, "role", e.target.value)}
                  >
                    {ROLES_EQUIPE.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="case">
                  <input
                    type="checkbox"
                    checked={Boolean(u.is_active)}
                    disabled={u.id === session.id}
                    onChange={(e) => majChampUtilisateur(u.id, "is_active", e.target.checked)}
                  />
                  {t.actif}
                </label>
                <button
                  type="button"
                  className="bouton bouton-contour"
                  onClick={() => enregistrerUtilisateur(u)}
                >
                  {t.enregistrer}
                </button>
              </div>
            ))}
          </div>

          <h3>{t.nouveauMembreTitre}</h3>
          <form className="gestion-grille-form" onSubmit={creerUtilisateur}>
            <label className="champ">
              {t.nomComplet}
              <input
                required
                minLength={2}
                value={nouveau.full_name}
                onChange={(e) => setNouveau((n) => ({ ...n, full_name: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.email}
              <input
                type="email"
                required
                value={nouveau.email}
                onChange={(e) => setNouveau((n) => ({ ...n, email: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.telephone}
              <input
                type="tel"
                value={nouveau.phone}
                onChange={(e) => setNouveau((n) => ({ ...n, phone: e.target.value }))}
              />
            </label>
            <label className="champ">
              {t.role}
              <select
                value={nouveau.role}
                onChange={(e) => setNouveau((n) => ({ ...n, role: e.target.value }))}
              >
                {ROLES_EQUIPE.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="champ champ-large">
              {t.motDePasseTemporaire}
              <input
                type="password"
                required
                minLength={12}
                value={nouveau.password}
                onChange={(e) => setNouveau((n) => ({ ...n, password: e.target.value }))}
              />
            </label>
            <div className="gestion-actions-carte champ-large">
              <button type="submit" className="bouton bouton-principal">
                {t.ajouterMembre}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
