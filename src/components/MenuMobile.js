"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Menu du téléphone. Il reste un <details> natif, donc il fonctionne sans JavaScript.
// Avec JavaScript, il se referme quand on change de page, avec Échap et au clic à l'extérieur.
export default function MenuMobile({ libelle, children }) {
  const menu = useRef(null);
  const chemin = usePathname();

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [chemin]);

  useEffect(() => {
    const clavier = (e) => {
      if (e.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    const clic = (e) => {
      if (menu.current?.open && !menu.current.contains(e.target)) menu.current.open = false;
    };
    document.addEventListener("keydown", clavier);
    document.addEventListener("mousedown", clic);
    return () => {
      document.removeEventListener("keydown", clavier);
      document.removeEventListener("mousedown", clic);
    };
  }, []);

  return (
    <details className="menu-mobile" ref={menu}>
      <summary>{libelle}</summary>
      {children}
    </details>
  );
}
