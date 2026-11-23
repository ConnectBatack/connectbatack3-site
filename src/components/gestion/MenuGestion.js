"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function IconeMenu({ nom }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (nom) {
    case "hamburger":
      return (
        <svg {...props}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "tableau":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "projets":
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "registre":
      return (
        <svg {...props}>
          <path d="M4 4h16v16H4z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="12" y2="17" />
        </svg>
      );
    case "poids":
      return (
        <svg {...props}>
          <path d="M12 3v18M4 7h16M6 7l-3 7h6l-3-7zM18 7l-3 7h6l-3-7z" />
        </svg>
      );
    case "plan":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "parametres":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.79 1 1.44 1.07H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "site":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}

function initiales(nom) {
  const parts = String(nom || "CB").trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export default function MenuGestion({
  lang,
  langueUi,
  titreEspace,
  labelNouveauProjet,
  groupes,
  utilisateur,
  labelSite,
  labelDeconnexion,
}) {
  const chemin = usePathname();
  const router = useRouter();
  const [reduite, setReduite] = useState(false);
  const [mobileOuvert, setMobileOuvert] = useState(false);

  async function seDeconnecter() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push(`/${lang}/connexion`);
    router.refresh();
  }

  return (
    <>
      <div className="gmail-topbar-mobile">
        <button
          type="button"
          className="gmail-icon-btn"
          aria-label="Menu"
          aria-expanded={mobileOuvert}
          onClick={() => setMobileOuvert((v) => !v)}
        >
          <IconeMenu nom="hamburger" />
        </button>
        <Link className="gmail-brand-texte" href={`/${lang}/gestion`}>
          <strong>Batack</strong>
          <span>{titreEspace}</span>
        </Link>
      </div>

      {mobileOuvert && (
        <div
          className="gmail-backdrop"
          aria-hidden="true"
          onClick={() => setMobileOuvert(false)}
        />
      )}

      <aside className={`gmail-sidebar ${reduite ? "reduite" : ""} ${mobileOuvert ? "ouvert" : ""}`}>
        <div className="gmail-sidebar-entete">
          <button
            type="button"
            className="gmail-icon-btn"
            title={reduite ? "Déplier le menu" : "Réduire le menu"}
            aria-label={reduite ? "Déplier le menu" : "Réduire le menu"}
            onClick={() => setReduite((r) => !r)}
          >
            <IconeMenu nom="hamburger" />
          </button>
          {!reduite && (
            <Link
              className="gmail-brand-texte"
              href={`/${lang}/gestion`}
              onClick={() => setMobileOuvert(false)}
            >
              <strong>Batack</strong>
              <span>{titreEspace}</span>
            </Link>
          )}
        </div>

        <Link
          href={`/${lang}/gestion/projets?nouveau=1`}
          className="gmail-compose-btn"
          title={labelNouveauProjet}
          onClick={() => setMobileOuvert(false)}
        >
          <IconeMenu nom="plus" />
          {!reduite && <span>{labelNouveauProjet}</span>}
        </Link>

        <nav className="gmail-nav" aria-label={titreEspace}>
          {groupes.map((groupe, idx) => (
            <div key={groupe.titre || idx} className="gmail-nav-groupe">
              {idx > 0 && <hr className="gmail-separateur" />}
              {!reduite && groupe.titre && <p className="gmail-groupe-titre">{groupe.titre}</p>}
              {groupe.liens.map((l) => {
                const actif = chemin === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    title={l.texte}
                    className={`gmail-nav-item ${actif ? "actif" : ""}`}
                    aria-current={actif ? "page" : undefined}
                    onClick={() => setMobileOuvert(false)}
                  >
                    <IconeMenu nom={l.icone} />
                    {!reduite && <span className="gmail-nav-texte">{l.texte}</span>}
                    {!reduite && Number(l.badge) > 0 && (
                      <span className="gmail-nav-badge">{l.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="gmail-sidebar-bas">
          <hr className="gmail-separateur" />
          <Link
            href={`/${lang}`}
            title={labelSite}
            className="gmail-nav-item"
            onClick={() => setMobileOuvert(false)}
          >
            <IconeMenu nom="site" />
            {!reduite && <span className="gmail-nav-texte">{labelSite}</span>}
          </Link>

          {!reduite && (
            <div className="gmail-langues" aria-label="Langue / Language">
              <Link href="/fr/gestion" aria-current={langueUi === "fr" ? "true" : undefined}>
                FR
              </Link>
              <Link href="/en/gestion" aria-current={langueUi === "en" ? "true" : undefined}>
                EN
              </Link>
            </div>
          )}

          <div className="gmail-profil-carte" title={utilisateur.nom}>
            <span className="gmail-avatar">{initiales(utilisateur.nom)}</span>
            {!reduite && (
              <div className="gmail-profil-meta">
                <strong>{utilisateur.nom}</strong>
                <small>{utilisateur.role}</small>
              </div>
            )}
          </div>

          <button
            type="button"
            className="gmail-nav-item gmail-logout-btn"
            title={labelDeconnexion}
            onClick={seDeconnecter}
          >
            <IconeMenu nom="logout" />
            {!reduite && <span className="gmail-nav-texte">{labelDeconnexion}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
