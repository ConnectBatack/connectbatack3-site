import "./Authentification.css";

function Inscription() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        <p>Rejoignez la communauté du COVIDEBA.</p>

        <form>
          <label>Nom complet</label>
          <input type="text" placeholder="Votre nom complet" required />

          <label>Adresse e-mail</label>
          <input type="email" placeholder="Votre adresse e-mail" required />

          <label>Numéro de téléphone</label>
          <input type="tel" placeholder="Votre numéro de téléphone" required />

          <label>Mot de passe</label>
          <input type="password" placeholder="Créer un mot de passe" required />

          <label>Confirmer le mot de passe</label>
          <input type="password" placeholder="Confirmer le mot de passe" required />

          <button type="submit">Créer mon compte</button>
        </form>

        <p>Vous avez déjà un compte ? <a href="#connexion">Se connecter</a></p>
      </div>
    </div>
  );
}

export default Inscription;