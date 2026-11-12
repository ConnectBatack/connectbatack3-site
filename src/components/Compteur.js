"use client";

import { useEffect, useRef, useState } from "react";

// Nombre qui monte jusqu'à sa valeur quand il entre dans l'écran.
// Sans JavaScript, ou si le visiteur a demandé moins de mouvement, la valeur finale s'affiche directement.
export default function Compteur({ valeur, langue, devise = false, pourcentage = false }) {
  const ref = useRef(null);
  const [affiche, setAffiche] = useState(valeur);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setAffiche(0);
    let demande = null;
    const obs = new IntersectionObserver(([entree]) => {
      if (!entree.isIntersecting) return;
      obs.disconnect();
      const debut = performance.now();
      const duree = 1600;
      const etape = (maintenant) => {
        const t = Math.min(1, (maintenant - debut) / duree);
        setAffiche(Math.round(valeur * (1 - Math.pow(1 - t, 3))));
        if (t < 1) demande = requestAnimationFrame(etape);
      };
      demande = requestAnimationFrame(etape);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (demande !== null) cancelAnimationFrame(demande);
    };
  }, [valeur]);

  const format = devise
    ? { style: "currency", currency: "EUR", maximumFractionDigits: 0 }
    : pourcentage
      ? { style: "percent", maximumFractionDigits: 0 }
      : { maximumFractionDigits: 0 };
  const texte = new Intl.NumberFormat(langue, format).format(pourcentage ? affiche / 100 : affiche);

  return <strong ref={ref}>{texte}</strong>;
}
