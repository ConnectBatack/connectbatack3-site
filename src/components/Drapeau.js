import { useId } from "react";

// Drapeau associé à chaque langue (choix de Roy, 13/11/2026) : France, Royaume-Uni, Espagne, Pays-Bas.
// Dessinés en SVG : les émojis drapeaux ne s'affichent pas sous Windows.
// Tous sont recadrés au même format 4:3 pour s'aligner dans le menu.
// Purement décoratifs : le nom de la langue est toujours écrit à côté.
export default function Drapeau({ langue }) {
  const id = useId();
  const attributs = {
    className: "drapeau",
    width: 20,
    height: 15,
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true,
    focusable: "false",
  };

  if (langue === "fr") {
    return (
      <svg {...attributs} viewBox="0 0 3 2">
        <rect width="1" height="2" fill="#002654" />
        <rect x="1" width="1" height="2" fill="#fff" />
        <rect x="2" width="1" height="2" fill="#ce1126" />
      </svg>
    );
  }
  if (langue === "es") {
    // Version simplifiée, sans les armoiries, illisibles à cette taille.
    return (
      <svg {...attributs} viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#aa151b" />
        <rect y="0.5" width="3" height="1" fill="#f1bf00" />
      </svg>
    );
  }
  if (langue === "nl") {
    return (
      <svg {...attributs} viewBox="0 0 9 6">
        <rect width="9" height="2" fill="#ae1c28" />
        <rect y="2" width="9" height="2" fill="#fff" />
        <rect y="4" width="9" height="2" fill="#21468b" />
      </svg>
    );
  }
  // Royaume-Uni
  return (
    <svg {...attributs} viewBox="0 0 60 30">
      <clipPath id={`${id}-cadre`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-diag`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-cadre)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-diag)`} stroke="#c8102e" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}
