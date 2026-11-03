import "./Authentification.css";

function Connexion() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Bienvenue sur CODEBA</h2>
        <p>Connectez-vous à votre espace donateur.</p>

        <form>
          <label>Adresse e-mail</label>
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Votre mot de passe"
            required
          />

          <button type="submit">Se connecter</button>
        </form>

        <p>
          Vous n'avez pas de compte ?{" "}
          <a href="#inscription">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}

export default Connexion;