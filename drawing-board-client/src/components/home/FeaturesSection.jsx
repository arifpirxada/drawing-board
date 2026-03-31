import useScrollAnimation from "../../lib/useScrollAnimation";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="#de89c9" strokeWidth="2" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="#de89c9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Real-time Collaboration",
    description:
      "Draw together with your team simultaneously. Every stroke is instantly broadcast via Socket.IO so everyone stays perfectly in sync.",
    accent: "#de89c9",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Kafka-Backed Streaming",
    description:
      "Events flow through Apache Kafka, giving you fault-tolerant, high-throughput message delivery that scales to thousands of users.",
    accent: "#a78bfa",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="#60a5fa" strokeWidth="2" />
        <path d="M7 7V3M17 7V3M3 11h18" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "File & Project Management",
    description:
      "Organise your work into files from your personal dashboard. Create, rename and open drawing boards in one central place.",
    accent: "#60a5fa",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="7" r="4" stroke="#34d399" strokeWidth="2" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 8v6M22 11h-6" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Multi-user Live Presence",
    description:
      "See exactly who's on the canvas with live cursor tracking, user avatars and presence indicators — no guessing required.",
    accent: "#34d399",
  },
];

const FeaturesSection = () => {
  useScrollAnimation();

  return (
    <section className="features-section" id="features" aria-label="Features">
      <div className="section-container">
        {/* Header */}
        <div className="section-header animate-on-scroll">
          <span className="section-label">What makes it powerful</span>
          <h2 className="section-title">
            Everything you need to create, <br className="hidden md:block" />
            <span className="gradient-text">together.</span>
          </h2>
          <p className="section-subtitle">
            We combined the fastest real-time primitives with an intuitive
            canvas so your team can focus on ideas, not infrastructure.
          </p>
        </div>

        {/* Cards grid */}
        <div className="features-grid">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={`feature-card animate-on-scroll animate-delay-${(i + 1) * 100}`}
              style={{ "--feature-accent": feature.accent }}
            >
              <div className="feature-icon" style={{ "--feature-accent": feature.accent }}>
                {feature.icon}
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
