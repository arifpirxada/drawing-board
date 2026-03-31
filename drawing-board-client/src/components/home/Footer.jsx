import { Link } from "react-router-dom";

const FooterLink = ({ to, children, id }) => (
  <Link to={ to } className="footer-link" id={ id }>
    { children }
  </Link>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="home-footer" aria-label="Site footer">
      <div className="footer-inner">
        {/* Brand */ }
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="home-logo__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  stroke="#de89c9"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="home-logo__text">Real-Time Drawing Board</span>
          </div>
          <p className="footer-tagline">
            Collaborate on a canvas, in real time. Powered by Socket.IO and Kafka.
          </p>
        </div>

        {/* Nav columns */ }
        <div className="footer-nav">
          <div className="footer-nav-col">
            <h4 className="footer-nav-heading">Product</h4>
            <nav aria-label="Footer product links">
              <button
                className="footer-link"
                onClick={ () =>
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }
                id="footer-features-link"
              >
                Features
              </button>
              <button
                className="footer-link"
                onClick={ () =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
                id="footer-howitworks-link"
              >
                How It Works
              </button>
            </nav>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-nav-heading">Account</h4>
            <nav aria-label="Footer account links">
              <FooterLink to="/login" id="footer-login-link">Login</FooterLink>
              <FooterLink to="/signup" id="footer-signup-link">Sign Up</FooterLink>
              <FooterLink to="/dashboard" id="footer-dashboard-link">Dashboard</FooterLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */ }
      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; { year } Real-Time Drawing Board. Built with React, Socket.IO &amp; Kafka.
        </p>
        <div className="footer-bottom-links">
          <a
            href="https://github.com/arifpirxada/drawing-board"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-github"
            id="footer-github-link"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
