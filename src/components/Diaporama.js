"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PRECHARGEMENT_MS = 1500; // la photo suivante est chargée 1,5 s avant le fondu

// Connexion lente ou économie de données demandée : on garde une seule photo, sans défilement.
function connexionEconome() {
  const c = typeof navigator !== "undefined" ? navigator.connection : null;
  return Boolean(c && (c.saveData || /(^|-)2g$|3g/.test(c.effectiveType ?? "")));
}

// Photos de fond qui se succèdent en fondu. Seule la photo affichée est chargée, plus la suivante
// juste avant le changement : les autres ne coûtent rien en données mobiles.
// Le défilement s'arrête si le visiteur demande moins de mouvement, s'il est sur une connexion
// lente, ou s'il choisit une photo avec les points.
export default function Diaporama({ photos, intervalle = 6000, t }) {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);
  const [precharge, setPrecharge] = useState(false);
  // Photo qui vient d'être remplacée : gardée le temps du fondu, puis retirée.
  const [precedente, setPrecedente] = useState(null);
  const suivante = (active + 1) % photos.length;

  function changer(i) {
    setPrecedente(active);
    setActive(i);
    setPrecharge(false);
  }

  useEffect(() => {
    if (precedente === null) return;
    const id = setTimeout(() => setPrecedente(null), 1600);
    return () => clearTimeout(id);
  }, [precedente]);

  useEffect(() => {
    if (pause || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connexionEconome()) return;
    const avant = setTimeout(() => setPrecharge(true), intervalle - PRECHARGEMENT_MS);
    const changement = setTimeout(() => {
      setPrecedente(active);
      setActive((active + 1) % photos.length);
      setPrecharge(false);
    }, intervalle);
    return () => {
      clearTimeout(avant);
      clearTimeout(changement);
    };
  }, [pause, active, photos.length, intervalle]);

  return (
    <>
      {photos.map((photo, i) =>
        i === active || i === precedente || (precharge && i === suivante) ? (
          <div key={photo.src} className={`diapo ${i === active ? "active" : ""}`} aria-hidden={i !== active}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ) : null
      )}
      {photos.length > 1 && (
        <div className="diapo-commandes" role="group" aria-label={t.libelle}>
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className="diapo-point"
              aria-label={photo.alt}
              aria-current={i === active}
              onClick={() => {
                if (i !== active) changer(i);
                setPause(true);
              }}
            >
              <span />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
