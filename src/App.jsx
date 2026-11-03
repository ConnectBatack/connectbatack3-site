import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";

const projets = [
  {
    numero: "01",
    categorie: "ÉNERGIE",
    titre: "Électrification du village",
    description:
      "Contribuer à améliorer l'accès à l'électricité pour les habitants de Batack.",
    symbole: "ϟ",
    couleur: "or",
  },
  {
    numero: "02",
    categorie: "COMMERCE",
    titre: "Aménagement du marché",
    description:
      "Améliorer les espaces de vente et les conditions de travail des commerçants.",
    symbole: "▦",
    couleur: "vert",
  },
  {
    numero: "03",
    categorie: "INFRASTRUCTURES",
    titre: "Projet routier",
    description:
      "Faciliter les déplacements et l'accès aux différentes zones de Batack.",
    symbole: "↗",
    couleur: "bleu",
  },
  {
    numero: "04",
    categorie: "SANTÉ",
    titre: "Projet du centre de santé",
    description:
      "Soutenir l'amélioration des services et des équipements de santé.",
    symbole: "+",
    couleur: "rouge",
  },
  {
    numero: "05",
    categorie: "ÉDUCATION",
    titre: "Salaire des enseignants",
    description:
      "Participer à l'amélioration des conditions d'apprentissage des enfants.",
    symbole: "📘",
    couleur: "violet",
  },
  {
    numero: "06",
    categorie: "EAU POTABLE",
    titre: "Accès à l'eau potable",
    description:
      "Contribuer à faciliter l'accès à une eau propre pour les habitants.",
    symbole: "◉",
    couleur: "turquoise",
  },
];

function Accueil() {
  return (
    <div className="site">
      <header className="header" id="accueil">
        <a className="logo" href="#accueil">
          <span className="logo-icon">✦</span>
          <span>
            <strong>COVIDEBA – Batack</strong>
            <small>Comité de développement du village Batack</small>
          </span>
        </a>

        <nav className="navigation">
          <a href="#accueil">Accueil</a>
          <a href="#projets">Nos projets</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="actions-header">
  <Link className="bouton bouton-connexion" to="/connexion">
    Se connecter
  </Link>

  <Link className="bouton bouton-header" to="/inscription">
    Créer un compte
  </Link>
</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-texte">
            <span className="surtitre">
              SOLIDARITÉ · DÉVELOPPEMENT · BATACK
            </span>
            <h1>
              Ensemble pour
              <br />
              <span>le développement</span>
              <br />
              de Batack
            </h1>
            <p>
              Le COVIDEBA, Comité de développement du village Batack, vous invite à
              soutenir les projets qui contribuent à améliorer les conditions
              de vie dans notre village. Chaque contribution compte !
            </p>
            <a className="bouton bouton-principal" href="#projets">
              ♥ <span>Soutenir les projets</span> <span>→</span>
            </a>
          </div>

          <div className="hero-decoration" aria-hidden="true">
            <div className="cercle cercle-un" />
            <div className="cercle cercle-deux" />
            <div className="feuille">✦</div>
            <div className="hero-message">
              <span>Unis pour notre village</span>
              <strong>Batack, notre avenir !</strong>
              <small>Une initiative portée par le COVIDEBA</small>
            </div>
          </div>
        </section>

        <section className="chiffres" aria-label="Notre engagement">
          <div className="chiffre">
            <span className="chiffre-icone">♧</span>
            <div>
              <strong>6</strong>
              <small>projets présentés</small>
            </div>
          </div>
          <div className="chiffre">
            <span className="chiffre-icone">⌖</span>
            <div>
              <strong>1</strong>
              <small>village : Batack</small>
            </div>
          </div>
          <div className="chiffre">
            <span className="chiffre-icone">♥</span>
            <div>
              <strong>1</strong>
              <small>objectif commun : développer Batack</small>
            </div>
          </div>
        </section>

        <section className="section-projets" id="projets">
          <div className="section-entete">
            <span className="surtitre">NOS PROJETS</span>
            <h2>Des projets pour un Batack meilleur</h2>
            <p>
              Découvrez les domaines de développement et les projets que le
              COVIDEBA pourra présenter aux personnes souhaitant contribuer.
            </p>
          </div>

          <div className="grille-projets">
            {projets.map((projet) => (
              <article
                className={`carte-projet ${projet.couleur}`}
                key={projet.numero}
              >
                <div className="carte-haut">
                  <span className="projet-icone">{projet.symbole}</span>
                  <div>
                    <strong>{projet.numero}</strong>
                    <small>{projet.categorie}</small>
                  </div>
                </div>

                <h3>{projet.titre}</h3>
                <p>{projet.description}</p>
                <a className="bouton bouton-carte" href="#contact">
                  Soutenir ce projet <span>→</span>
                </a>
              </article>
            ))}
          </div>

        </section>

        <section className="apropos" id="apropos">
          <div className="apropos-texte">
            <span className="surtitre">À PROPOS DE NOUS</span>
            <h2>Le COVIDEBA au service de Batack</h2>
            <p>
              Le COVIDEBA (Comité de développement du village Batack) est le comité
              consacré à la mobilisation autour des initiatives de développement
              du village. Cette plateforme a pour objectif de présenter les
              projets, de faciliter la participation des donateurs et de
              renforcer la solidarité.
            </p>
          </div>

          <div className="valeurs">
            <div className="valeur">
              <span>♡</span>
              <strong>Solidarité</strong>
              <p>Ensemble, nous avançons plus loin.</p>
            </div>
            <div className="valeur">
              <span>✦</span>
              <strong>Développement</strong>
              <p>Des initiatives utiles pour Batack.</p>
            </div>
            <div className="valeur">
              <span>♧</span>
              <strong>Engagement</strong>
              <p>Agir ensemble pour l'avenir.</p>
            </div>
          </div>
        </section>

        <section className="bandeau" id="contact">
          <div>
            <span>VOTRE SOUTIEN FAIT LA DIFFÉRENCE</span>
            <h2>Ensemble, construisons le Batack de demain.</h2>
            <p>Rejoignez la démarche du COVIDEBA et soutenez le développement de Batack.</p>
          </div>
          <a className="bouton bouton-or" href="mailto:">
            ♥ Faire un don <span>→</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo logo-footer" href="#accueil">
          <span className="logo-icon">✦</span>
          <span>
            <strong>COVIDEBA – Batack</strong>
            <small>Comité de développement de Batack</small>
          </span>
        </a>
        <div className="footer-centre">
          Unis pour le développement de notre village.
          <small>© 2026 COVIDEBA – Batack</small>
        </div>
        <div className="footer-liens">
          <a href="#accueil">Accueil</a>
          <a href="#projets">Projets</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;