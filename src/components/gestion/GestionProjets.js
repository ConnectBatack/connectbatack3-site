"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUES = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "nl", label: "Nederlands" },
];

const CATEGORIES_SUGGEREES = {
  fr: ["Santé", "Énergie", "Éducation", "Eau", "Économie", "Infrastructure"],
  en: ["Health", "Energy", "Education", "Water", "Economy", "Infrastructure"],
  es: ["Salud", "Energía", "Educación", "Agua", "Economía", "Infraestructura"],
  nl: ["Gezondheid", "Energie", "Onderwijs", "Water", "Economie", "Infrastructuur"],
};

const PHOTOS_STATIQUES = [
  "dispensaire-facade",
  "panneau-solaire",
  "salle-de-classe",
  "batack-paysage",
  "marche",
  "accueil-chants",
  "installation-electrique",
  "ecole-publique",
];

const PARITE_FCFA = 655.957;

function srcPhotoProjet(photoSlug, photoId) {
  if (photoSlug && PHOTOS_STATIQUES.includes(photoSlug)) {
    return `/images/${photoSlug}.jpg`;
  }
  if (photoId) {
    return `/api/media/${encodeURIComponent(photoId)}`;
  }
  return "/images/batack-paysage.jpg";
}

function etatInitialProjet(p) {
  if (!p) {
    return {
      slug: "",
      target_fcfa: "1000000",
      target_amount_eur: "1524.49",
      display_order: 10,
      status: "active",
      is_featured_need: false,
      photo_slug: "batack-paysage",
      photo_id: "",
      category: { fr: "", en: "", es: "", nl: "" },
      title: { fr: "", en: "", es: "", nl: "" },
      tagline: { fr: "", en: "", es: "", nl: "" },
      description: { fr: "", en: "", es: "", nl: "" },
    };
  }
  const eur = Number(p.target_amount_eur || 0);
  return {
    slug: p.slug,
    target_fcfa: String(Math.round(eur * PARITE_FCFA)),
    target_amount_eur: String(p.target_amount_eur || "0.00"),
    display_order: Number(p.display_order || 0),
    status: p.status || "active",
    is_featured_need: Boolean(p.is_featured_need),
    photo_slug: p.photo_slug || "",
    photo_id: p.photo_id || "",
    category: { fr: "", en: "", es: "", nl: "", ...(p.category || {}) },
    title: { fr: "", en: "", es: "", nl: "", ...(p.title || {}) },
    tagline: { fr: "", en: "", es: "", nl: "", ...(p.tagline || {}) },
    description: { fr: "", en: "", es: "", nl: "", ...(p.description || {}) },
  };
}

export default function GestionProjets({
  t,
  lang,
  projetsInitiaux,
  mediasInitiaux,
  nouveauInitial = false,
  peutModifier,
  estAdmin,
}) {
  const router = useRouter();
  const langueDefaut = LANGUES.some((l) => l.id === lang) ? lang : "fr";

  const [projets, setProjets] = useState(projetsInitiaux || []);
  const [medias, setMedias] = useState(mediasInitiaux || []);
  const premierSlug = nouveauInitial && peutModifier ? "__nouveau__" : projetsInitiaux?.[0]?.slug || "__nouveau__";
  const [selectionSlug, setSelectionSlug] = useState(premierSlug);
  const [form, setForm] = useState(() =>
    etatInitialProjet(premierSlug === "__nouveau__" ? null : projetsInitiaux?.[0] || null),
  );
  const [langueSource, setLangueSource] = useState(langueDefaut);
  const [langueApercu, setLangueApercu] = useState("en");
  const [traductionManuelle, setTraductionManuelle] = useState(false);
  const [etat, setEtat] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [tradEnCours, setTradEnCours] = useState(false);

  const enCreation = selectionSlug === "__nouveau__";
  const projetCourant = projets.find((p) => p.slug === selectionSlug) || null;
  const collecteFcfa = Math.round(Number(projetCourant?.collected_amount_eur || 0) * PARITE_FCFA);

  function choisirProjet(slug) {
    setSelectionSlug(slug);
    setEtat(null);
    setTraductionManuelle(false);
    if (slug === "__nouveau__") {
      setForm(etatInitialProjet(null));
      return;
    }
    const trouve = projets.find((p) => p.slug === slug);
    setForm(etatInitialProjet(trouve || null));
  }

  function majTexteSource(champ, valeur) {
    setForm((f) => ({
      ...f,
      [champ]: { ...f[champ], [langueSource]: valeur },
    }));
  }

  function majTexteApercu(champ, valeur) {
    setTraductionManuelle(true);
    setForm((f) => ({
      ...f,
      [champ]: { ...f[champ], [langueApercu]: valeur },
    }));
  }

  function majMontantFcfa(valeur) {
    const fcfa = Math.max(0, Number(valeur || 0));
    const eur = (fcfa / PARITE_FCFA).toFixed(2);
    setForm((f) => ({ ...f, target_fcfa: valeur, target_amount_eur: eur }));
  }

  function majMontantEur(valeur) {
    const eur = Math.max(0, Number(valeur || 0));
    const fcfa = String(Math.round(eur * PARITE_FCFA));
    setForm((f) => ({ ...f, target_amount_eur: valeur, target_fcfa: fcfa }));
  }

  async function televerserPhoto(file) {
    if (!file) return;
    setEtat(null);
    const body = new FormData();
    body.append("file", file);
    if (form.slug) body.append("slug", `${form.slug}-${Date.now()}`);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Échec du téléversement.");
      setMedias((liste) => [data, ...liste]);
      setForm((f) => ({ ...f, photo_id: data.id, photo_slug: data.slug || "" }));
      setEtat({ type: "ok", texte: t.photoUploadOk });
    } catch (err) {
      setEtat({ type: "erreur", texte: err.message });
    }
  }

  async function previsualiserTraductions() {
    setEtat(null);
    setTradEnCours(true);
    try {
      const res = await fetch("/api/admin/projects/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_language: langueSource,
          category: form.category[langueSource] || "",
          title: form.title[langueSource] || "",
          tagline: form.tagline[langueSource] || "",
          description: form.description[langueSource] || "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Erreur de traduction.");
      setForm((f) => ({
        ...f,
        category: { ...f.category, ...data.category },
        title: { ...f.title, ...data.title },
        tagline: { ...f.tagline, ...data.tagline },
        description: { ...f.description, ...data.description },
      }));
      setTraductionManuelle(true);
      setEtat({ type: "ok", texte: t.traductionOk });
    } catch (err) {
      setEtat({ type: "erreur", texte: err.message });
    } finally {
      setTradEnCours(false);
    }
  }

  async function enregistrer(e) {
    e.preventDefault();
    setEtat(null);
    setEnvoi(true);

    const autoTranslate = !traductionManuelle;
    const payload = {
      source_language: langueSource,
      auto_translate: autoTranslate,
      overwrite_translations: true,
      category: autoTranslate
        ? { [langueSource]: form.category[langueSource] || "" }
        : form.category,
      title: autoTranslate
        ? { [langueSource]: form.title[langueSource] || "" }
        : form.title,
      tagline: autoTranslate
        ? { [langueSource]: form.tagline[langueSource] || "" }
        : form.tagline,
      description: autoTranslate
        ? { [langueSource]: form.description[langueSource] || "" }
        : form.description,
      target_amount_eur: form.target_amount_eur || "0.00",
      display_order: Number(form.display_order || 0),
      status: form.status,
      is_featured_need: Boolean(form.is_featured_need),
      photo_slug: form.photo_slug || null,
      photo_id: form.photo_id || null,
    };

    try {
      const url = enCreation
        ? "/api/admin/projects"
        : `/api/admin/projects/${encodeURIComponent(selectionSlug)}`;
      const method = enCreation ? "POST" : "PATCH";
      const corps = enCreation && form.slug.trim() ? { slug: form.slug.trim().toLowerCase(), ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Erreur lors de l'enregistrement.");

      if (enCreation) {
        setProjets((liste) => [...liste, data]);
        setSelectionSlug(data.slug);
        setForm(etatInitialProjet(data));
        setEtat({ type: "ok", texte: t.creeOk });
      } else {
        setProjets((liste) => liste.map((p) => (p.slug === data.slug ? data : p)));
        setForm(etatInitialProjet(data));
        setEtat({ type: "ok", texte: t.enregistreOk });
      }
      setTraductionManuelle(false);
      router.refresh();
    } catch (err) {
      setEtat({ type: "erreur", texte: err.message });
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer() {
    if (enCreation || !window.confirm(t.confirmerSuppression)) return;
    setEtat(null);
    setEnvoi(true);
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(selectionSlug)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Suppression impossible.");
      const restants = projets.filter((p) => p.slug !== selectionSlug);
      setProjets(restants);
      const suivant = restants[0] || null;
      setSelectionSlug(suivant ? suivant.slug : "__nouveau__");
      setForm(etatInitialProjet(suivant));
      setEtat({ type: "ok", texte: t.supprimeOk });
      router.refresh();
    } catch (err) {
      setEtat({ type: "erreur", texte: err.message });
    } finally {
      setEnvoi(false);
    }
  }

  const photosGalerie = [
    ...PHOTOS_STATIQUES.map((s) => ({
      cle: s,
      slug: s,
      id: medias.find((m) => m.slug === s)?.id || "",
      src: `/images/${s}.jpg`,
      label: s.replace(/-/g, " "),
    })),
    ...medias
      .filter((m) => !PHOTOS_STATIQUES.includes(m.slug))
      .map((m) => ({
        cle: m.id,
        slug: m.slug || "",
        id: m.id,
        src: `/api/media/${encodeURIComponent(m.id)}`,
        label: m.slug || m.original_filename || "Photo",
      })),
  ];

  const categoriesPills = CATEGORIES_SUGGEREES[langueSource] || CATEGORIES_SUGGEREES.fr;

  return (
    <div className="gestion-sections">
      {!peutModifier && <p className="avertissement">{t.lectureSeule}</p>}

      <div className="admin-projets-grille" role="tablist" aria-label={t.titre}>
        {projets.map((p) => {
          const objFcfa = Math.round(Number(p.target_amount_eur || 0) * PARITE_FCFA);
          const src = srcPhotoProjet(p.photo_slug, p.photo_id);
          return (
            <button
              key={p.slug}
              type="button"
              className={`admin-projet-vignette ${selectionSlug === p.slug ? "actif" : ""}`}
              onClick={() => choisirProjet(p.slug)}
            >
              <Image src={src} alt="" width={56} height={56} unoptimized={src.startsWith("/api/")} />
              <span>
                <strong>{p.title?.[langueSource] || p.title?.fr || p.title?.en || p.slug}</strong>
                <small>{objFcfa.toLocaleString("fr-FR")} FCFA</small>
              </span>
            </button>
          );
        })}
        {peutModifier && (
          <button
            type="button"
            className={`admin-projet-vignette admin-projet-nouveau ${enCreation ? "actif" : ""}`}
            onClick={() => choisirProjet("__nouveau__")}
          >
            {t.nouveau}
          </button>
        )}
      </div>

      <form className="gestion-carte" onSubmit={enregistrer}>
        {projetCourant && (
          <p className="aide">
            {t.collecteInfo
              .replace("{fcfa}", collecteFcfa.toLocaleString("fr-FR"))
              .replace("{count}", String(projetCourant.contributors_count))}
          </p>
        )}

        <div className="admin-etape-entete">
          <span className="admin-etape-badge">1</span>
          <h2>{t.etape1}</h2>
        </div>

        <div className="admin-info-traduction">{t.infoTraductionAuto}</div>

        <div className="gestion-grille-form">
          <label className="champ">
            {t.langueRedaction}
            <select
              disabled={!peutModifier}
              value={langueSource}
              onChange={(e) => {
                const nv = e.target.value;
                setLangueSource(nv);
                setLangueApercu(nv === "fr" ? "en" : "fr");
              }}
            >
              {LANGUES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <label className="champ">
            {t.titreProjet}
            <input
              required
              disabled={!peutModifier}
              maxLength={200}
              placeholder="Ex : Forage d'eau potable à Batack"
              value={form.title[langueSource] || ""}
              onChange={(e) => majTexteSource("title", e.target.value)}
            />
          </label>

          <div className="champ champ-large">
            <label className="champ">
              {t.categorie}
              <input
                disabled={!peutModifier}
                maxLength={120}
                value={form.category[langueSource] || ""}
                onChange={(e) => majTexteSource("category", e.target.value)}
              />
            </label>
            {peutModifier && (
              <div className="admin-pilules">
                {categoriesPills.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`admin-pilule ${form.category[langueSource] === cat ? "actif" : ""}`}
                    onClick={() => majTexteSource("category", cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="champ champ-large">
            {t.accroche}
            <input
              disabled={!peutModifier}
              maxLength={300}
              placeholder="Ex : Apporter de l'eau potable près de chaque famille"
              value={form.tagline[langueSource] || ""}
              onChange={(e) => majTexteSource("tagline", e.target.value)}
            />
          </label>

          <label className="champ champ-large">
            {t.description}
            <textarea
              rows={4}
              disabled={!peutModifier}
              maxLength={4000}
              placeholder="Décrivez simplement la situation actuelle et à quoi serviront les dons."
              value={form.description[langueSource] || ""}
              onChange={(e) => majTexteSource("description", e.target.value)}
            />
          </label>
        </div>

        <div className="admin-etape-entete">
          <span className="admin-etape-badge">2</span>
          <h2>{t.etape2}</h2>
        </div>

        <div className="gestion-grille-form">
          <label className="champ">
            {t.objectifFcfa}
            <input
              type="number"
              step="100"
              min="0"
              required
              disabled={!peutModifier}
              value={form.target_fcfa}
              onChange={(e) => majMontantFcfa(e.target.value)}
            />
          </label>

          <label className="champ">
            {t.objectifEur}
            <input
              type="number"
              step="0.01"
              min="0"
              required
              disabled={!peutModifier}
              value={form.target_amount_eur}
              onChange={(e) => majMontantEur(e.target.value)}
            />
          </label>
        </div>

        <div className="champ">
          <span>{t.photoSlug}</span>
          <div className="admin-photos-grille">
            {photosGalerie.map((ph) => {
              const estActive =
                (ph.id && form.photo_id === ph.id) || (ph.slug && form.photo_slug === ph.slug);
              return (
                <button
                  key={ph.cle}
                  type="button"
                  disabled={!peutModifier}
                  className={`admin-photo-choix ${estActive ? "actif" : ""}`}
                  onClick={() =>
                    setForm((f) => ({ ...f, photo_slug: ph.slug, photo_id: ph.id || "" }))
                  }
                >
                  <Image
                    src={ph.src}
                    alt={ph.label}
                    width={140}
                    height={105}
                    unoptimized={ph.src.startsWith("/api/")}
                  />
                  <span>{ph.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {peutModifier && (
          <label className="champ">
            {t.uploadPhoto}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => televerserPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
        )}

        <div className="admin-etape-entete">
          <span className="admin-etape-badge">3</span>
          <h2>{t.etape3}</h2>
        </div>

        <div className="gestion-grille-form">
          <label className="champ">
            {t.statut}
            <select
              disabled={!peutModifier}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="active">{t.statutActive}</option>
              <option value="completed">{t.statutCompleted}</option>
              <option value="archived">{t.statutArchived}</option>
            </select>
          </label>
          <label className="champ">
            {t.ordre}
            <input
              type="number"
              min="0"
              max="1000"
              disabled={!peutModifier}
              value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
            />
          </label>
          <label className="case champ-large">
            <input
              type="checkbox"
              disabled={!peutModifier}
              checked={Boolean(form.is_featured_need)}
              onChange={(e) => setForm((f) => ({ ...f, is_featured_need: e.target.checked }))}
            />
            {t.besoinAvant}
          </label>
        </div>

        <details className="admin-details-trad">
          <summary>{t.voirTraductions}</summary>
          <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
            {peutModifier && (
              <div className="gestion-actions-carte">
                <button
                  type="button"
                  className="bouton bouton-contour"
                  disabled={tradEnCours}
                  onClick={previsualiserTraductions}
                >
                  {tradEnCours ? t.traductionEnCours : t.traduireApercu}
                </button>
              </div>
            )}
            <div className="gestion-onglets">
              {LANGUES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`bouton ${langueApercu === l.id ? "bouton-principal" : "bouton-contour"}`}
                  onClick={() => setLangueApercu(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="gestion-grille-form">
              <label className="champ">
                {t.categorie} ({langueApercu.toUpperCase()})
                <input
                  disabled={!peutModifier}
                  value={form.category[langueApercu] || ""}
                  onChange={(e) => majTexteApercu("category", e.target.value)}
                />
              </label>
              <label className="champ">
                {t.titreProjet} ({langueApercu.toUpperCase()})
                <input
                  disabled={!peutModifier}
                  value={form.title[langueApercu] || ""}
                  onChange={(e) => majTexteApercu("title", e.target.value)}
                />
              </label>
              <label className="champ champ-large">
                {t.accroche} ({langueApercu.toUpperCase()})
                <input
                  disabled={!peutModifier}
                  value={form.tagline[langueApercu] || ""}
                  onChange={(e) => majTexteApercu("tagline", e.target.value)}
                />
              </label>
              <label className="champ champ-large">
                {t.description} ({langueApercu.toUpperCase()})
                <textarea
                  rows={3}
                  disabled={!peutModifier}
                  value={form.description[langueApercu] || ""}
                  onChange={(e) => majTexteApercu("description", e.target.value)}
                />
              </label>
              {enCreation && (
                <label className="champ champ-large">
                  {t.slug}
                  <input
                    pattern="[a-z0-9-]{2,64}"
                    placeholder="Laissez vide pour génération automatique"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  />
                </label>
              )}
            </div>
          </div>
        </details>

        {etat?.texte && (
          <p
            className={etat.type === "erreur" ? "message message-erreur" : "message"}
            role={etat.type === "erreur" ? "alert" : "status"}
          >
            {etat.texte}
          </p>
        )}

        {peutModifier && (
          <div className="gestion-actions-carte">
            <button type="submit" className="bouton bouton-principal bouton-grand" disabled={envoi}>
              {envoi ? "..." : enCreation ? t.creer : t.enregistrer}
            </button>
            {estAdmin && !enCreation && (
              <button
                type="button"
                className="bouton bouton-contour"
                disabled={envoi}
                onClick={supprimer}
              >
                {t.supprimer}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
