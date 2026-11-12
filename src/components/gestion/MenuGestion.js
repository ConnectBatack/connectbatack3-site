"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu latéral de la gestion ; met en évidence la page en cours.
export default function MenuGestion({ liens }) {
  const chemin = usePathname();
  return (
    <nav className="gestion-liens">
      {liens.map((l) => (
        <Link key={l.href} href={l.href} aria-current={chemin === l.href ? "page" : undefined}>
          {l.texte}
        </Link>
      ))}
    </nav>
  );
}
