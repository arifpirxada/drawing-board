import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { authApi, tokenStorage } from "../../features/auth/auth";
import AuthContext from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const CornerBracket = ({ position }) => (
  <div className={`auth-corner auth-corner--${position}`} aria-hidden="true">
    <div className="auth-corner__h" />
    <div className="auth-corner__v" />
  </div>
);

function SignupForm() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerUser = async (data) => {
    try {
      setSubmitting(true);

      if (data.password !== data.cpassword) {
        setErrorMessage("Passwords do not match");
        setSubmitting(false);
        return;
      }

      const res = await authApi.createUser(data);

      if (res.success && res.access_token) {
        setSuccess(true);
        tokenStorage.setToken(res.access_token);
        setIsLoggedIn(true);
        setUser(res.user);
        navigate("/dashboard");
      } else {
        throw new Error("Registration unsuccessful");
      }
      setErrorMessage("");
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setSuccess(false);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage("Registration unsuccessful! Please try later");
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const fields = [
    {
      id: "sign-name",
      name: "name",
      type: "text",
      label: "Full name",
      placeholder: "Jane Doe",
      autoComplete: "name",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      rules: { required: "Name is required" },
    },
    {
      id: "sign-email",
      name: "email",
      type: "email",
      label: "Email address",
      placeholder: "you@example.com",
      autoComplete: "email",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      rules: { required: "Email is required" },
    },
    {
      id: "sign-password",
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "••••••••",
      autoComplete: "new-password",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      rules: {
        required: "Password is required",
        minLength: { value: 4, message: "Password must be at least 4 characters" },
      },
    },
    {
      id: "sign-c-password",
      name: "cpassword",
      type: "password",
      label: "Confirm password",
      placeholder: "••••••••",
      autoComplete: "new-password",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      rules: { required: "Please confirm your password" },
    },
  ];

  return (
    <div className="auth-page">
      {/* Background layers */}
      <div className="auth-bg-glow auth-bg-glow--tl" aria-hidden="true" />
      <div className="auth-bg-glow auth-bg-glow--br" aria-hidden="true" />
      <div className="auth-bg-grid" aria-hidden="true" />
      <div className="auth-scanlines" aria-hidden="true" />

      <div className="auth-container auth-container--signup">
        {/* Form card (full-width on signup, centered) */}
        <div className="auth-form-panel auth-form-panel--wide">
          <div className="auth-card auth-card--wide">
            <CornerBracket position="tl" />
            <CornerBracket position="tr" />
            <CornerBracket position="bl" />
            <CornerBracket position="br" />

            {/* Header */}
            <div className="auth-card__header">
              {/* Logo inline */}
              <Link to="/" className="auth-inline-logo" aria-label="Home">
                <div className="auth-brand-logo auth-brand-logo--sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      stroke="#cc55e8"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="auth-inline-logo__text">Real time Drawing board</span>
              </Link>

              <div className="auth-status-badge auth-status-badge--cyan">
                <span className="auth-status-dot auth-status-dot--cyan" />
                NEW ACCOUNT
              </div>
              <h1 className="auth-card__title">Create your account</h1>
              <p className="auth-card__subtitle">
                Start drawing and collaborating in real time — free forever
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(registerUser)} className="auth-form auth-form--grid" noValidate>
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`auth-field ${focusedField === field.id ? "auth-field--focused" : ""}`}
                >
                  <label htmlFor={field.id} className="auth-field__label">
                    {field.icon}
                    {field.label}
                  </label>
                  <div className="auth-field__input-wrap">
                    <input
                      {...register(field.name, field.rules)}
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      className="auth-field__input"
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                    />
                    <div className="auth-field__line" />
                  </div>
                  {errors[field.name]?.message && (
                    <span className="auth-field__error">{errors[field.name].message}</span>
                  )}
                </div>
              ))}

              {/* Feedback — spans both columns */}
              {errorMessage && (
                <div className="auth-alert auth-alert--error auth-alert--span" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {errorMessage}
                </div>
              )}
              {success && (
                <div className="auth-alert auth-alert--success auth-alert--span" role="status">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Account created — redirecting…
                </div>
              )}

              {/* Submit + link row — spans both columns */}
              <div className="auth-form__footer">
                <button
                  type="submit"
                  id="signup-submit-btn"
                  className="free-trial-btn auth-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="auth-spinner" aria-hidden="true" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <p className="auth-switch">
                  Already a member?{" "}
                  <Link to="/login" className="auth-switch__link" id="goto-login-link">
                    Sign in
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;