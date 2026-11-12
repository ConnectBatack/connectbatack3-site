"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Photos de fond qui se succèdent en fondu. Le défilement s'arrête si le visiteur
// a demandé moins de mouvement, ou s'il choisit une photo avec les points.
export default function Diaporama({ photos, intervalle = 6000, libelle }) {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuterie = setInterval(() => setActive((i) => (i + 1) % photos.length), intervalle);
    return () => clearInterval(minuterie);
  }, [pause, photos.length, intervalle]);

  return (
    <>
      {photos.map((photo, i) => (
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
      ))}
      {photos.length > 1 && (
        <div className="diapo-points" role="group" aria-label={libelle}>
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              aria-label={photo.alt}
              aria-current={i === active}
              onClick={() => {
                setActive(i);
                setPause(true);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
