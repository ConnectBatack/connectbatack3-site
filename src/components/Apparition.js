"use client";

import { useEffect, useRef, useState } from "react";

// Fait apparaître son contenu quand il entre dans l'écran.
// Le contenu est visible par défaut : sans JavaScript (ou pour un moteur de recherche),
// rien n'est caché. Il n'est masqué qu'après le chargement, et seulement s'il est hors de l'écran.
export default function Apparition({ children, className = "", as: Balise = "div" }) {
  const ref = useRef(null);
  const [etat, setEtat] = useState("initial");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setEtat("cache");
    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setEtat("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Balise ref={ref} className={`apparition apparition-${etat} ${className}`}>
      {children}
    </Balise>
  );
}
