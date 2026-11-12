"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Bandeau photo : l'image se déplace plus lentement que la page pendant le défilement.
// Effet désactivé si le visiteur a demandé moins de mouvement.
export default function Parallaxe({ src, alt, children, vitesse = 0.18 }) {
  const bloc = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let demande = null;
    const placer = () => {
      demande = null;
      const r = bloc.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      // L'image dépasse de 15 % en haut et en bas : on ne la déplace jamais plus que ça.
      const limite = r.height * 0.14;
      const brut = (r.top + r.height / 2 - window.innerHeight / 2) * -vitesse;
      const decalage = Math.max(-limite, Math.min(limite, brut));
      image.current.style.transform = `translate3d(0, ${decalage.toFixed(1)}px, 0)`;
    };
    const auDefilement = () => {
      if (demande === null) demande = requestAnimationFrame(placer);
    };
    placer();
    window.addEventListener("scroll", auDefilement, { passive: true });
    window.addEventListener("resize", auDefilement);
    return () => {
      window.removeEventListener("scroll", auDefilement);
      window.removeEventListener("resize", auDefilement);
      if (demande !== null) cancelAnimationFrame(demande);
    };
  }, [vitesse]);

  return (
    <section className="parallaxe" ref={bloc}>
      <div className="parallaxe-image" ref={image}>
        <Image src={src} alt={alt} fill sizes="100vw" />
      </div>
      <div className="parallaxe-contenu">{children}</div>
    </section>
  );
}
