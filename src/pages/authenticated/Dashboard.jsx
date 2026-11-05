import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContent } from "../../stores/AuthStore";

function formatSessionDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}

function Dashboard() {
  const { user } = useContext(AuthContent);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    const controller = new AbortController();

    async function fetchSessions() {
      try {
        const response = await fetch(
          "https://ai-care-backend-45fz.onrender.com/api/v1/chat/sessions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to fetch your chat history.");
        }

        if (
          !Array.isArray(data.data?.sessions) ||
          data.data.sessions.some((session) => !session.sessionId)
        ) {
          throw new Error("The server returned an invalid sessions response.");
        }

        setSessions(data.data.sessions);
        setSessionsError("");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Error fetching chat history:", error);
        setSessionsError(
          error.message ?? "An error occurred while loading your chat history.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSessions(false);
        }
      }
    }

    fetchSessions();
    return () => controller.abort();
  }, [retryCount]);

  const createSession = async () => {
    setIsCreatingSession(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Please sign in again to start a conversation.");
      }

      const response = await fetch(
        "https://ai-care-backend-45fz.onrender.com/api/v1/chat/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to create a new conversation.");
      }

      const session = data.data?.session;
      if (!session?.sessionId) {
        throw new Error("The server did not return the new conversation ID.");
      }

      setSessions((currentSessions) => [
        session,
        ...currentSessions.filter(
          (item) => item.sessionId !== session.sessionId,
        ),
      ]);
      navigate(`/chat/${session.sessionId}`);
    } catch (error) {
      console.error("Error creating a chat session:", error);
      toast.error(
        error.message ?? "An error occurred while creating a conversation.",
      );
    } finally {
      setIsCreatingSession(false);
    }
  };

  const firstName = user?.username?.trim().split(/\s+/)[0];
  const sortedSessions = [...sessions].sort((first, second) => {
    const firstTime = new Date(
      first.updatedAt ?? first.createdAt ?? 0,
    ).getTime();
    const secondTime = new Date(
      second.updatedAt ?? second.createdAt ?? 0,
    ).getTime();

    return (
      (Number.isNaN(secondTime) ? 0 : secondTime) -
      (Number.isNaN(firstTime) ? 0 : firstTime)
    );
  });

  return (
    <main className="dashboard-home">
      <header className="dashboard-home-header">
        <Link className="landing-brand" to="/" aria-label="AI Care home">
          <span className="landing-brand-mark" aria-hidden="true">+</span>
          <span>ai care</span>
        </Link>
        <span className="dashboard-header-label">YOUR CARE SPACE</span>
      </header>

      <section className="dashboard-welcome">
        <div>
          <span className="landing-eyebrow">WELCOME TO YOUR CARE SPACE</span>
          <h1>
            Welcome{firstName ? `, ${firstName}` : " back"}.
            <br />
            <em>What&apos;s on your mind?</em>
          </h1>
          <p>
            Start a new conversation or pick up where you left off. Your
            previous chats are all in one place.
          </p>
        </div>
        <button
          className="landing-button dashboard-new-chat-button"
          onClick={createSession}
          disabled={isCreatingSession}
        >
          <span className="dashboard-new-chat-icon" aria-hidden="true">+</span>
          {isCreatingSession ? "Starting a conversation..." : "New conversation"}
          {!isCreatingSession && <span aria-hidden="true">↗</span>}
        </button>
      </section>

      <section className="dashboard-history" aria-labelledby="dashboard-history-title">
        <div className="dashboard-history-heading">
          <div>
            <span className="landing-eyebrow">YOUR CONVERSATIONS</span>
            <h2 id="dashboard-history-title">Chat history</h2>
          </div>
          {!isLoadingSessions && !sessionsError && (
            <span className="dashboard-history-count">
              {sessions.length} {sessions.length === 1 ? "chat" : "chats"}
            </span>
          )}
        </div>

        {isLoadingSessions ? (
          <div className="dashboard-history-state" role="status">
            <span className="dashboard-loading-spinner" />
            Loading your conversations...
          </div>
        ) : sessionsError ? (
          <div className="dashboard-history-state dashboard-history-error" role="alert">
            <p>{sessionsError}</p>
            <button
              className="dashboard-retry-button"
              onClick={() => {
                setIsLoadingSessions(true);
                setSessionsError("");
                setRetryCount((count) => count + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="dashboard-history-empty">
            <span className="dashboard-empty-icon" aria-hidden="true">✳</span>
            <h3>Your chat history starts here.</h3>
            <p>
              Start a conversation whenever you have a question. You can come
              back to it here.
            </p>
            <button
              className="dashboard-empty-link"
              onClick={createSession}
              disabled={isCreatingSession}
            >
              {isCreatingSession ? "Starting..." : "Start your first conversation"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        ) : (
          <div className="dashboard-history-list">
            {sortedSessions.map((session) => {
              const date = session.updatedAt ?? session.createdAt;
              const createdDate = session.createdAt
                ? formatSessionDate(session.createdAt).split(",")[0]
                : "";
              const title =
                session.title ??
                session.name ??
                (createdDate ? `Chat · ${createdDate}` : "Health conversation");

              return (
                <Link
                  className="dashboard-history-card"
                  key={session._id ?? session.sessionId}
                  to={`/chat/${session.sessionId}`}
                >
                  <span className="dashboard-history-card-icon" aria-hidden="true">
                    ✳
                  </span>
                  <span className="dashboard-history-card-copy">
                    <strong>{title}</strong>
                    <span>
                      {session.preview ??
                        session.lastMessage ??
                        "Open to view your messages"}
                    </span>
                  </span>
                  <span className="dashboard-history-card-date">
                    {formatSessionDate(date)}
                  </span>
                  <span className="dashboard-history-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
