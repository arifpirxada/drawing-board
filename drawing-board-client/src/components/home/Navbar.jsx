import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { authApi } from "../../features/auth/auth";

const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      stroke="#de89c9"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HamburgerIcon = ({ open }) => (
  <div className="home-hamburger-icon" aria-label="Toggle menu">
    <span className={ `ham-bar ${open ? "ham-bar--top-open" : ""}` } />
    <span className={ `ham-bar ${open ? "ham-bar--mid-open" : ""}` } />
    <span className={ `ham-bar ${open ? "ham-bar--bot-open" : ""}` } />
  </div>
);

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    authApi.logoutUser();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={ `home-navbar${scrolled ? " home-navbar--scrolled" : ""}` } role="navigation">
      <div className="home-navbar__inner">
        {/* Logo */ }
        <Link to="/" className="home-logo" aria-label="Real-Time Drawing Board home">
          <div className="home-logo__icon">
            <PencilIcon />
          </div>
          <span className="home-logo__text">Real-Time Drawing Board</span>
        </Link>

        {/* Desktop Nav Links */ }
        <div className="home-navbar__links">
          <button className="home-nav-link" onClick={ () => scrollTo("features") }>
            Features
          </button>
          <button className="home-nav-link" onClick={ () => scrollTo("how-it-works") }>
            How It Works
          </button>
        </div>

        {/* Desktop Auth Actions */ }
        <div className="home-navbar__actions">
          { isLoggedIn ? (
            <>
              <Link to="/dashboard" className="home-btn-ghost" id="nav-dashboard-btn">
                Dashboard
              </Link>
              <button onClick={ logout } className="home-btn-outline" id="nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="home-btn-ghost" id="nav-login-btn">
                Login
              </Link>
              <Link to="/signup" className="free-trial-btn home-cta-sm" id="nav-signup-btn">
                Get Started
              </Link>
            </>
          ) }
        </div>

        {/* Mobile Hamburger */ }
        <button
          className="home-hamburger"
          onClick={ () => setMenuOpen((v) => !v) }
          aria-expanded={ menuOpen }
          aria-label="Open navigation menu"
          id="nav-hamburger-btn"
        >
          <HamburgerIcon open={ menuOpen } />
        </button>
      </div>

      {/* Mobile Menu Dropdown */ }
      <div className={ `home-mobile-menu${menuOpen ? " home-mobile-menu--open" : ""}` }>
        <button className="home-nav-link" onClick={ () => scrollTo("features") }>
          Features
        </button>
        <button className="home-nav-link" onClick={ () => scrollTo("how-it-works") }>
          How It Works
        </button>
        <div className="home-mobile-menu__divider" />
        { isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="home-nav-link"
              onClick={ () => setMenuOpen(false) }
              id="mobile-dashboard-btn"
            >
              Dashboard
            </Link>
            <button onClick={ logout } className="home-nav-link" id="mobile-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="home-nav-link"
              onClick={ () => setMenuOpen(false) }
              id="mobile-login-btn"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="free-trial-btn"
              onClick={ () => setMenuOpen(false) }
              id="mobile-signup-btn"
            >
              Get Started
            </Link>
          </>
        ) }
      </div>
    </nav>
  );
};

export default Navbar;
