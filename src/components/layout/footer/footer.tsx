import { Link } from "@tanstack/react-router";
import "./footer.scss";
import { Image } from "@unpic/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="brand-logo">
            <Image
              src="/logo.svg"
              alt="Logo de Silverlog"
              className="logo"
              layout="constrained"
              width={40}
              height={40}
              background="auto"
              priority
            />
            <span className="font-sentient brand-name">Silverlog</span>
          </Link>
          <p className="footer-description text-secondary truncate-3-lines">
            Votre journal cinématographique personnel. Gardez une trace de tous
            les films que vous avez vus, découvrez-en de nouveaux et partagez
            vos listes avec la communauté.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h3 className="col-title font-sentient">Navigation</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="link">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/discover" className="link">
                  Découvrir
                </Link>
              </li>
              <li>
                <Link to="/user/activity" className="link">
                  Mon Activité
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="col-title font-sentient">Légal</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="link">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/antoinevignes"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright text-secondary">
            &copy; {currentYear} Silverlog. Tous droits réservés.
          </p>
          <p className="credits text-secondary">
            Données fournies par{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="underline-link"
            >
              TMDB
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
