import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import useScrollAnimation from "../../lib/useScrollAnimation";

const CtaSection = () => {
  const { isLoggedIn } = useContext(AuthContext);
  useScrollAnimation();

  return (
    <section className="cta-section" id="cta" aria-label="Call to action">
      {/* decorative blobs */}
      <div className="cta-blob cta-blob--left" aria-hidden="true" />
      <div className="cta-blob cta-blob--right" aria-hidden="true" />

      <div className="section-container cta-inner animate-on-scroll">
        <div className="cta-icon-ring" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              stroke="#de89c9"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="cta-headline">
          Ready to start drawing <span className="gradient-text">together?</span>
        </h2>
        <p className="cta-description">
          Join creators and teams that collaborate on the canvas in real time.
          Free to start, no setup required.
        </p>

        <div className="cta-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="free-trial-btn" id="cta-dashboard-btn">
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="free-trial-btn" id="cta-signup-btn">
                Create Free Account
              </Link>
              <Link to="/login" className="hero-secondary-btn" id="cta-login-btn">
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
