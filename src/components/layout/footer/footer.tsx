import { Link } from "@tanstack/react-router";
import "./footer.scss";
import { Image } from "@unpic/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer pt-2xl">
      <div className="container footer-content gap-xl pb-xl">
        <div className="footer-brand gap-sm">
          <Link to="/" className="brand-logo gap-sm">
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
            <span className="font-fraunces brand-name">Silverlog</span>
          </Link>
          <p className="footer-description text-secondary truncate-3-lines">
            Votre journal cinématographique personnel. Gardez une trace de tous
            les films que vous avez vus, découvrez-en de nouveaux et partagez
            vos listes avec la communauté.
          </p>
        </div>

        <div className="footer-links-grid gap-xl">
          <div className="footer-col">
            <h3 className="col-title font-fraunces mb-md">Navigation</h3>
            <ul className="footer-links gap-sm">
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
            <h3 className="col-title font-fraunces mb-md">Légal</h3>
            <ul className="footer-links gap-sm">
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

      <div className="footer-bottom py-md">
        <div className="container footer-bottom-content gap-xs">
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
