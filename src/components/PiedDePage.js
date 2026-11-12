export default function PiedDePage({ dict }) {
  return (
    <footer className="pied">
      <p>{dict.pied.texte}</p>
      <small>{dict.pied.droits}</small>
    </footer>
  );
}
