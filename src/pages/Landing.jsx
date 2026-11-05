import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Landing() {
  const token = localStorage.getItem("auth_token");
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(Boolean(token));
  const [sessionsError, setSessionsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchSessions() {
      setIsLoadingSessions(true);
      setSessionsError("");

      try {
        const response = await fetch(
          "https://ai-care-backend-45fz.onrender.com/api/v1/chat/sessions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to fetch your conversations.");
        }

        if (
          !Array.isArray(data.data?.sessions) ||
          data.data.sessions.some((session) => !session.sessionId)
        ) {
          throw new Error("The server returned an invalid sessions response.");
        }

        setSessions(data.data.sessions);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setSessionsError(
          error.message ?? "An error occurred while loading conversations.",
        );
      } finally {
        setIsLoadingSessions(false);
      }
    }

    fetchSessions();
  }, [retryCount, token]);

  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="AI Care home">
          <span className="landing-brand-mark" aria-hidden="true">+</span>
          <span>ai care</span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#conversations">Your conversations</a>
        </nav>
        <div className="landing-header-actions">
          <Link className="landing-login-link" to="/login">Log in</Link>
          <Link className="landing-button landing-button-small" to="/register">
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">
            <span className="landing-eyebrow-dot" />
            A little more clarity, when you need it
          </span>
          <h1>Care starts with a <em>conversation.</em></h1>
          <p>
            Get a thoughtful place to ask health questions, understand possible
            next steps, and feel more prepared for the conversations that matter.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button" to="/register">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
            <a className="landing-text-link" href="#how-it-works">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="landing-trust-note">
            <span aria-hidden="true">✳</span>
            A helpful starting point—not a replacement for professional care.
          </div>
        </div>

        <div className="landing-hero-art" aria-label="Example AI Care conversation">
          <div className="landing-art-orbit landing-art-orbit-one" />
          <div className="landing-art-orbit landing-art-orbit-two" />
          <div className="landing-art-sun" aria-hidden="true">✳</div>
          <div className="landing-chat-card">
            <div className="landing-chat-card-top">
              <span className="landing-card-brand">
                <span className="landing-brand-mark" aria-hidden="true">+</span>
                AI Care
              </span>
              <span className="landing-online"><span /> Here to help</span>
            </div>
            <div className="landing-chat-greeting">
              <span className="landing-chat-avatar" aria-hidden="true">✳</span>
              <div>
                <small>Your care companion</small>
                <p>Hi there. What would you like to talk through today?</p>
              </div>
            </div>
            <div className="landing-chat-question">
              I&apos;ve had a headache since this morning. What should I keep in mind?
            </div>
            <div className="landing-chat-response">
              <span className="landing-response-label">A thoughtful first step</span>
              <p>
                I can help you think through what you&apos;re experiencing and
                suggest questions you may want to ask a healthcare professional.
              </p>
              <div className="landing-response-tags">
                <span>Helpful context</span>
                <span>Next steps</span>
              </div>
            </div>
            <div className="landing-chat-input">
              <span>Share what&apos;s on your mind...</span>
              <span className="landing-chat-send" aria-hidden="true">↑</span>
            </div>
          </div>
          <div className="landing-art-caption">
            <span className="landing-caption-sparkle" aria-hidden="true">✦</span>
            A calmer way to find your next step
          </div>
        </div>
      </section>

      <section className="landing-stat-strip" aria-label="AI Care principles">
        <p><span>01</span> Start with your questions</p>
        <p><span>02</span> Get clear, considered guidance</p>
        <p><span>03</span> Feel ready for what comes next</p>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="landing-section-intro">
          <span className="landing-eyebrow">HOW AI CARE FITS IN</span>
          <h2>One conversation can make things feel clearer.</h2>
          <p>
            Share what&apos;s on your mind at your own pace. AI Care helps you
            organize your thoughts and explore what you might do next.
          </p>
        </div>
        <div className="landing-steps">
          <article className="landing-step">
            <span className="landing-step-number">01</span>
            <span className="landing-step-icon" aria-hidden="true">✎</span>
            <h3>Tell us what&apos;s going on</h3>
            <p>Ask a health question in your own words and add context that feels useful.</p>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">02</span>
            <span className="landing-step-icon" aria-hidden="true">✳</span>
            <h3>Explore helpful guidance</h3>
            <p>Get a clear response with follow-up prompts to help you think it through.</p>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">03</span>
            <span className="landing-step-icon" aria-hidden="true">↗</span>
            <h3>Consider your next step</h3>
            <p>Use the conversation to prepare for care and decide what to ask next.</p>
          </article>
        </div>
      </section>

      <section className="landing-sessions" id="conversations">
        <div className="landing-feature-heading">
          <div>
            <span className="landing-eyebrow">YOUR AI CARE CONVERSATIONS</span>
            <h2>Pick up where you left off.</h2>
          </div>
          <p>Choose a conversation to open its details.</p>
        </div>
        {!token ? (
          <div className="landing-sessions-empty">
            <p>Log in to see your conversations and continue a chat.</p>
            <Link className="landing-button landing-button-small" to="/login">
              Log in to your account <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : isLoadingSessions ? (
          <p className="landing-sessions-message" role="status">
            Loading your conversations...
          </p>
        ) : sessionsError ? (
          <div className="landing-sessions-empty" role="alert">
            <p>{sessionsError}</p>
            <button
              className="landing-button landing-button-small"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again <span aria-hidden="true">↻</span>
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="landing-sessions-empty">
            <p>You don&apos;t have any conversations yet.</p>
            <Link className="landing-button landing-button-small" to="/dashboard">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : (
          <div className="landing-session-grid">
            {[...sessions]
              .sort(
                (first, second) => {
                  const firstDate = new Date(
                    first.updatedAt ?? first.createdAt ?? 0,
                  ).getTime();
                  const secondDate = new Date(
                    second.updatedAt ?? second.createdAt ?? 0,
                  ).getTime();
                  return (
                    (Number.isNaN(secondDate) ? 0 : secondDate) -
                    (Number.isNaN(firstDate) ? 0 : firstDate)
                  );
                },
              )
              .map((session, index) => {
                const updatedAt = session.updatedAt ?? session.createdAt;
                const date = updatedAt ? new Date(updatedAt) : null;
                const updatedDate =
                  date && !Number.isNaN(date.getTime())
                    ? date.toLocaleString()
                    : "Date unavailable";

                return (
                  <Link
                    className="landing-session-card"
                    key={session._id ?? session.sessionId}
                    to={`/chat/${session.sessionId}`}
                  >
                    <span className="landing-session-index">
                      CONVERSATION {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="landing-session-title">
                      Your care conversation
                    </span>
                    <span className="landing-session-date">
                      Last updated {updatedDate}
                    </span>
                    <span className="landing-session-open">
                      Open conversation <span aria-hidden="true">↗</span>
                    </span>
                  </Link>
                );
              })}
          </div>
        )}
      </section>

      <section className="landing-cta">
        <span className="landing-cta-flower" aria-hidden="true">✳</span>
        <div>
          <span className="landing-eyebrow">A GOOD PLACE TO BEGIN</span>
          <h2>Your questions deserve thoughtful attention.</h2>
          <p>Start a conversation and take the next step at your own pace.</p>
        </div>
        <Link className="landing-button landing-button-light" to="/register">
          Get started <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" to="/" aria-label="AI Care home">
          <span className="landing-brand-mark" aria-hidden="true">+</span>
          <span>ai care</span>
        </Link>
        <p>Supportive guidance, with your wellbeing in mind.</p>
        <span>AI Care is not a substitute for professional medical advice.</span>
      </footer>
    </main>
  );
}

export default Landing;
