import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { authApi, tokenStorage } from "../../features/auth/auth";
import AuthContext from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

/* ── Decorative corner bracket ── */
const CornerBracket = ({ position }) => (
  <div className={`auth-corner auth-corner--${position}`} aria-hidden="true">
    <div className="auth-corner__h" />
    <div className="auth-corner__v" />
  </div>
);

function LoginForm() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const loginUser = async (data) => {
    try {
      setSubmitting(true);
      const res = await authApi.loginUser(data);
      if (res.success && res.access_token) {
        setSuccess(true);
        tokenStorage.setToken(res.access_token);
        setIsLoggedIn(true);
        setUser(res.user);
        navigate("/dashboard");
      } else {
        throw new Error("Login unsuccessful");
      }
      setErrorMessage("");
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setSuccess(false);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage("Login unsuccessful! Please try later");
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      {/* Background layers */}
      <div className="auth-bg-glow auth-bg-glow--tl" aria-hidden="true" />
      <div className="auth-bg-glow auth-bg-glow--br" aria-hidden="true" />
      <div className="auth-bg-grid" aria-hidden="true" />

      {/* Scanline overlay */}
      <div className="auth-scanlines" aria-hidden="true" />

      <div className="auth-container">
        {/* Left panel — branding */}
        <div className="auth-brand-panel" aria-hidden="true">
          <div className="auth-brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                stroke="#cc55e8"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="auth-brand-name">Real time<br />Drawing board</h2>
          <p className="auth-brand-tagline">
            Collaborate on a canvas,<br />in real time.
          </p>

          {/* feature list */}
          <ul className="auth-feature-list">
            {[
              { icon: "⚡", text: "Powered by Kafka + Socket.IO" },
              { icon: "🎨", text: "Full-featured vector canvas" },
              { icon: "👥", text: "Live multi-user presence" },
            ].map((f) => (
              <li key={f.text} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          {/* decorative grid lines */}
          <div className="auth-brand-decoration" />
        </div>

        {/* Right panel — form */}
        <div className="auth-form-panel">
          <div className="auth-card">
            {/* Corner brackets */}
            <CornerBracket position="tl" />
            <CornerBracket position="tr" />
            <CornerBracket position="bl" />
            <CornerBracket position="br" />

            {/* Header */}
            <div className="auth-card__header">
              <div className="auth-status-badge">
                <span className="auth-status-dot" />
                SECURE LOGIN
              </div>
              <h1 className="auth-card__title">Welcome back</h1>
              <p className="auth-card__subtitle">
                Enter your credentials to access your boards
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(loginUser)} className="auth-form" noValidate>
              {/* Email */}
              <div className={`auth-field ${focusedField === "email" ? "auth-field--focused" : ""}`}>
                <label htmlFor="email" className="auth-field__label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Email address
                </label>
                <div className="auth-field__input-wrap">
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    id="email"
                    className="auth-field__input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className="auth-field__line" />
                </div>
                {errors.email && (
                  <span className="auth-field__error">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div className={`auth-field ${focusedField === "password" ? "auth-field--focused" : ""}`}>
                <label htmlFor="password" className="auth-field__label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Password
                </label>
                <div className="auth-field__input-wrap">
                  <input
                    {...register("password", { required: "Password is required" })}
                    type="password"
                    id="password"
                    className="auth-field__input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className="auth-field__line" />
                </div>
                {errors.password?.message && (
                  <span className="auth-field__error">{errors.password.message}</span>
                )}
              </div>

              {/* Feedback */}
              {errorMessage && (
                <div className="auth-alert auth-alert--error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {errorMessage}
                </div>
              )}
              {success && (
                <div className="auth-alert auth-alert--success" role="status">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Login successful — redirecting…
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="login-submit-btn"
                className="free-trial-btn auth-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="auth-spinner" aria-hidden="true" />
                    Authenticating…
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Footer link */}
              <p className="auth-switch">
                Not a member?{" "}
                <Link to="/signup" className="auth-switch__link" id="goto-signup-link">
                  Create an account
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;