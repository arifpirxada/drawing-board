import useScrollAnimation from "../../lib/useScrollAnimation";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Create Your Account",
    description:
      "Sign up in seconds. No credit card required. Your personal dashboard is ready the moment you log in.",
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Open a Drawing Board",
    description:
      "Create a new board from your dashboard, give it a name, and land straight on the full-featured canvas.",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Invite &amp; Draw Together",
    description:
      "Add collaborators, share the link, and watch everyone's strokes appear live. Real-time, zero lag.",
  },
];

const HowItWorksSection = () => {
  useScrollAnimation();

  return (
    <section className="how-section" id="how-it-works" aria-label="How it works">
      <div className="section-container">
        {/* Header */}
        <div className="section-header animate-on-scroll">
          <span className="section-label">Simple by design</span>
          <h2 className="section-title">
            Up and drawing in{" "}
            <span className="gradient-text">three steps.</span>
          </h2>
          <p className="section-subtitle">
            Getting started takes under a minute. Here&apos;s how the whole flow works.
          </p>
        </div>

        {/* Steps */}
        <div className="steps-row">
          {steps.map((step, i) => (
            <div key={step.number} className="step-wrapper">
              <article
                className={`step-card animate-on-scroll animate-delay-${(i + 1) * 100}`}
              >
                <div className="step-number-badge">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-card__title" dangerouslySetInnerHTML={{ __html: step.title }} />
                <p className="step-card__desc">{step.description}</p>
              </article>

              {/* Connector arrow between steps (not after last) */}
              {i < steps.length - 1 && (
                <div className="step-connector" aria-hidden="true">
                  <div className="step-connector__line" />
                  <svg className="step-connector__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="rgba(222,137,201,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
