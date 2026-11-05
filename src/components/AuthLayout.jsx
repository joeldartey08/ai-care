import { Link } from "react-router-dom";

function AuthLayout({ mode, eyebrow, title, description, children }) {
  return (
    <main className={`auth-page auth-page-${mode}`}>
      <aside className="auth-aside">
        <Link className="auth-brand" to="/" aria-label="AI Care home">
          <span className="auth-brand-mark" aria-hidden="true">+</span>
          <span>ai care</span>
        </Link>

        <div className="auth-aside-copy">
          <span className="auth-aside-eyebrow">
            CARE THAT STARTS WITH YOU
          </span>
          <h1>A little more clarity for your wellbeing.</h1>
          <p>
            A thoughtful space to ask health questions, explore guidance, and
            feel more prepared for what comes next.
          </p>
        </div>

        <div className="auth-art" aria-hidden="true">
          <span className="auth-art-orbit auth-art-orbit-one" />
          <span className="auth-art-orbit auth-art-orbit-two" />
          <span className="auth-art-sparkle">✳</span>
          <div className="auth-art-card">
            <span className="auth-art-card-icon">✳</span>
            <div>
              <span className="auth-art-card-label">YOUR CARE COMPANION</span>
              <p>One question at a time.</p>
            </div>
            <span className="auth-art-arrow">↗</span>
          </div>
          <span className="auth-art-caption">A calmer way to find your next step</span>
        </div>

        <p className="auth-aside-footnote">
          Supportive guidance, with your wellbeing in mind.
        </p>
      </aside>

      <section className="auth-content">
        <Link className="auth-back-link" to="/">
          <span aria-hidden="true">←</span> Back to AI Care
        </Link>
        <div className="auth-panel">
          <header className="auth-heading">
            <span className="auth-heading-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>
          {children}
          <p className="auth-privacy-note">
            <span aria-hidden="true">✳</span>
            Health information is personal. Share only what you&apos;re
            comfortable including.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
