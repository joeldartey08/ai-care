import { useEffect, useState } from "react";

function ChatSidebar({
  activeSessionId,
  sessionTitles,
  sessionUpdates,
  isOpen,
  onClose,
  onSelectSession,
  onSessionCreated,
  onSessionsLoaded,
  isSendingMessage,
}) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({ sessions: "" });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("You need to log in to load your sessions.");
        }

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
          throw new Error(data.message ?? "Failed to fetch sessions.");
        }

        if (!Array.isArray(data.data?.sessions)) {
          throw new Error("The server returned an invalid sessions response.");
        }

        setSessions(data.data.sessions);
        onSessionsLoaded(data.data.sessions);
        setErrors({ sessions: "" });
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setErrors({
          sessions:
            error.message ?? "An error occurred while loading sessions.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, [onSessionsLoaded, retryCount]);

  async function createSession() {
    setIsCreating(true);
    setErrors({ sessions: "" });

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("You need to log in to create a session.");
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
        throw new Error(data.message ?? "Failed to create a chat session.");
      }

      const session = data.data?.session;
      if (!session?.sessionId) {
        throw new Error("The server did not return the new session ID.");
      }

      const newSession = {
        _id: session._id,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };

      setSessions((currentSessions) => [
        newSession,
        ...currentSessions.filter(
          (item) => item.sessionId !== session.sessionId,
        ),
      ]);
      onSessionCreated(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      setErrors({
        sessions:
          error.message ?? "An error occurred while creating a session.",
      });
    } finally {
      setIsCreating(false);
    }
  }

  function getSessionTitle(session) {
    if (sessionTitles[session.sessionId]) {
      return sessionTitles[session.sessionId];
    }

    const date = session.createdAt
      ? new Date(session.createdAt).toLocaleDateString()
      : "Chat";
    return `Chat · ${date}`;
  }

  return (
    <aside className={`chat-sidebar ${isOpen ? "open" : ""}`}>
      <div className="chat-sidebar-header">
        <div>
          <h1>Chats</h1>
          <p>Your conversations</p>
        </div>
        <div className="chat-sidebar-actions">
          <button
            className="btn chat-new-button"
            onClick={createSession}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "New chat"}
          </button>
          <button
            className="chat-sidebar-close"
            aria-label="Close chat menu"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      {errors.sessions && (
        <div className="chat-error">
          <p>{errors.sessions}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setErrors({ sessions: "" });
              setRetryCount((count) => count + 1);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="chat-sidebar-message">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="chat-sidebar-message">No chats yet. Start a new chat.</p>
      ) : (
        <ul className="chat-session-list">
          {[...sessions]
            .sort(
              (first, second) =>
                new Date(
                  sessionUpdates[second.sessionId] ?? second.updatedAt ?? 0,
                ) -
                new Date(
                  sessionUpdates[first.sessionId] ?? first.updatedAt ?? 0,
                ),
            )
            .map((session) => (
            <li key={session._id ?? session.sessionId}>
              <button
                className={`chat-session-button ${
                  activeSessionId === session.sessionId ? "active" : ""
                }`}
                onClick={() => onSelectSession(session.sessionId)}
                disabled={isSendingMessage}
              >
                <span className="chat-session-title">
                  {getSessionTitle(session)}
                </span>
                <span className="chat-session-date">
                  {(sessionUpdates[session.sessionId] ?? session.updatedAt)
                    ? new Date(
                        sessionUpdates[session.sessionId] ?? session.updatedAt,
                      ).toLocaleString()
                    : ""}
                </span>
              </button>
            </li>
            ))}
        </ul>
      )}
    </aside>
  );
}

export default ChatSidebar;
