import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const HeroSection = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <section className="hero-section" id="hero" aria-label="Hero">
      {/* Background layers */}
      <div className="hero-glow hero-glow--center" aria-hidden="true" />
      <div className="hero-glow hero-glow--left" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        {/* Left — copy */}
        <div className="hero-copy">
          <div className="hero-badge" aria-label="Tech stack badge">
            <span className="hero-badge__dot" aria-hidden="true" />
            Powered by Socket.IO &amp; Kafka
          </div>

          <h1 className="hero-headline">
            Draw. Collaborate.{" "}
            <span className="gradient-text">Create in real time.</span>
          </h1>

          <p className="hero-description">
            A powerful collaborative canvas with real-time sync, live multi-user
            presence, and seamless file management. Built for creators who move fast.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="free-trial-btn" id="hero-signup-btn">
              Start Drawing Free
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="hero-secondary-btn" id="hero-dashboard-btn">
                Go to Dashboard
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="hero-secondary-btn" id="hero-login-btn">
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          {/* Social proof micro-strip */}
          <div className="hero-social-proof">
            <div className="hero-avatars" aria-hidden="true">
              {["#de89c9", "#7c3aed", "#2563eb", "#059669"].map((color, i) => (
                <div
                  key={i}
                  className="hero-avatar"
                  style={{ background: color, marginLeft: i === 0 ? 0 : "-10px", zIndex: 4 - i }}
                />
              ))}
            </div>
            <p className="hero-social-text">
              Real-time collaboration — draw with your team, right now.
            </p>
          </div>
        </div>

        {/* Right — GIF in browser mockup */}
        <div className="hero-visual">
          <div className="demo-browser-frame">
            <div className="browser-bar">
              <div className="browser-dots" aria-hidden="true">
                <span className="browser-dot browser-dot--red" />
                <span className="browser-dot browser-dot--yellow" />
                <span className="browser-dot browser-dot--green" />
              </div>
              <div className="browser-url" aria-label="Demo URL">
                drawing-board.app / canvas
              </div>
              <div className="browser-reload" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M23 4v6h-6M1 20v-6h6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="browser-content">
              <img
                src="/img/demo.gif"
                alt="Real time Drawing board in action — multiple users drawing simultaneously"
                loading="eager"
              />
            </div>
          </div>

          {/* Floating stat chips */}
          <div className="hero-chip hero-chip--tl" aria-hidden="true">
            <span className="chip-dot chip-dot--green" />
            <span>3 collaborators live</span>
          </div>
          <div className="hero-chip hero-chip--br" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#de89c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Synced in &lt;50ms</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
