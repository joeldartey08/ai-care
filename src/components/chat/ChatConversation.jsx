import { useEffect, useRef, useState } from "react";

function ChatConversation({
  sessionId,
  username,
  sessionTitle,
  onSessionTitleChange,
  onSessionUpdated,
  isSendingMessage,
  setIsSendingMessage,
  onOpenSidebar,
}) {
  const [chatData, setChatData] = useState({ sessionId: "", chats: [] });
  const [location, setLocation] = useState({
    sessionId: "",
    city: "",
    country: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    message: "",
    messages: { sessionId: "", message: "" },
  });
  const [retryCount, setRetryCount] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const currentRequestId = ++requestId.current;

    async function fetchMessages() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("You need to log in to view this session.");
        }

        const response = await fetch(
          `https://ai-care-backend-45fz.onrender.com/api/v1/chat/sessions/${sessionId}/messages`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to fetch session messages.");
        }

        if (!Array.isArray(data.data?.chats)) {
          throw new Error("The server returned an invalid messages response.");
        }

        if (currentRequestId === requestId.current) {
          const chats = data.data.chats;
          setChatData({ sessionId, chats });
          setLocation({
            sessionId,
            city: chats[chats.length - 1]?.city ?? "",
            country: chats[chats.length - 1]?.country ?? "",
          });
          setErrors((currentErrors) => ({
            ...currentErrors,
            messages: { sessionId: "", message: "" },
          }));

          if (chats[0]?.message) {
            onSessionTitleChange(sessionId, chats[0].message);
          }
        }
      } catch (error) {
        if (currentRequestId === requestId.current) {
          console.error("Error fetching session messages:", error);
          setErrors((currentErrors) => ({
            ...currentErrors,
            messages: {
              sessionId,
              message:
                error.message ?? "An error occurred while loading messages.",
            },
          }));
        }
      }
    }

    fetchMessages();
  }, [sessionId, retryCount, onSessionTitleChange]);

  async function sendMessage(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        message: "Enter a message before sending.",
      }));
      return;
    }

    if (!sessionId || chatData.sessionId !== sessionId) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        message: "Wait for the session messages to finish loading.",
      }));
      return;
    }

    setIsSendingMessage(true);
    setErrors((currentErrors) => ({ ...currentErrors, message: "" }));

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("You need to log in to send a message.");
      }

      const currentLocation =
        location.sessionId === sessionId ? location : {};
      const requestBody = { message: trimmedMessage };
      if (currentLocation.city?.trim()) {
        requestBody.city = currentLocation.city.trim();
      }
      if (currentLocation.country?.trim()) {
        requestBody.country = currentLocation.country.trim();
      }

      const response = await fetch(
        `https://ai-care-backend-45fz.onrender.com/api/v1/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to send your message.");
      }

      const result = data.data;
      if (!result?.response) {
        throw new Error("The server returned an invalid chat response.");
      }

      const newChat = {
        message: result.message ?? trimmedMessage,
        aiResponse: result.response.aiResponse ?? "",
        isMedicalRelated: result.response.isMedicalRelated,
        urgency: result.response.urgency,
        doctorRecommendation: result.response.doctorRecommendation,
        followUpQuestions: result.response.followUpQuestions ?? [],
        hospitals: result.response.hospitals ?? [],
        city: result.city ?? requestBody.city,
        country: result.country ?? requestBody.country,
        aiModel: result.aiModel,
        createdAt: new Date().toISOString(),
      };

      setChatData((currentData) =>
        currentData.sessionId === sessionId
          ? { ...currentData, chats: [...currentData.chats, newChat] }
          : currentData,
      );
      setMessage("");
      setLocation((currentLocationValue) =>
        currentLocationValue.sessionId === sessionId
          ? {
              sessionId,
              city: result.city ?? currentLocationValue.city ?? "",
              country: result.country ?? currentLocationValue.country ?? "",
            }
          : currentLocationValue,
      );
      setErrors((currentErrors) => ({ ...currentErrors, message: "" }));

      if (!sessionTitle || sessionTitle === "New chat") {
        onSessionTitleChange(sessionId, trimmedMessage);
      }
      onSessionUpdated(sessionId, newChat.createdAt);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrors((currentErrors) => ({
        ...currentErrors,
        message:
          error.message ?? "An error occurred while sending your message.",
      }));
    } finally {
      setIsSendingMessage(false);
    }
  }

  const isSending = isSendingMessage;
  const chats = chatData.sessionId === sessionId ? chatData.chats : [];
  const isLoadingMessages =
    Boolean(sessionId) &&
    chatData.sessionId !== sessionId &&
    errors.messages.sessionId !== sessionId;
  const showMessagesError = errors.messages.sessionId === sessionId;
  const city = location.sessionId === sessionId ? location.city : "";
  const country = location.sessionId === sessionId ? location.country : "";

  return (
    <main className="chat-main">
      <header className="chat-main-header">
        <button
          className="chat-menu-button"
          aria-label="Open chat menu"
          onClick={onOpenSidebar}
        >
          ☰
        </button>
        <h2>{sessionId ? sessionTitle ?? "Chat" : "Start a conversation"}</h2>
      </header>

      <section className="chat-messages" aria-live="polite">
        {!sessionId ? (
          <div className="chat-empty-state">
            <h3>Welcome{username ? `, ${username}` : ""}</h3>
            <p>Create a new chat to start a conversation.</p>
          </div>
        ) : isLoadingMessages ? (
          <p className="chat-state-message">Loading messages...</p>
        ) : showMessagesError ? (
          <div className="chat-empty-state">
            <p>{errors.messages.message}</p>
            <button
              className="btn"
              onClick={() => {
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  messages: { sessionId: "", message: "" },
                }));
                setChatData({ sessionId: "", chats: [] });
                setRetryCount((count) => count + 1);
              }}
            >
              Retry
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="chat-empty-state">
            <h3>New conversation</h3>
            <p>Send a message to get started.</p>
          </div>
        ) : (
          chats.map((chat, index) => (
            <article
              className="chat-exchange"
              key={chat._id ?? `${chat.createdAt ?? "chat"}-${index}`}
            >
              <div className="chat-user-message">
                <span className="chat-message-label">You</span>
                <p>{chat.message}</p>
              </div>
              <div className="chat-ai-message">
                <span className="chat-message-label">AI Care</span>
                <p>{chat.aiResponse ?? "No response was provided."}</p>
                {chat.urgency && chat.urgency !== "none" && (
                  <p className="chat-detail">
                    Urgency: <strong>{chat.urgency}</strong>
                  </p>
                )}
                {chat.doctorRecommendation && (
                  <p className="chat-detail">{chat.doctorRecommendation}</p>
                )}
                {chat.followUpQuestions?.length > 0 && (
                  <div className="chat-detail">
                    <strong>Follow-up questions</strong>
                    <ul>
                      {chat.followUpQuestions.map((question, questionIndex) => (
                        <li key={`${question}-${questionIndex}`}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {chat.hospitals?.length > 0 && (
                  <div className="chat-detail">
                    <strong>Hospitals</strong>
                    <ul>
                      {chat.hospitals.map((hospital, hospitalIndex) => (
                        <li key={`${hospital.name}-${hospitalIndex}`}>
                          {hospital.sourceUrl ? (
                            <a
                              href={hospital.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {hospital.name}
                            </a>
                          ) : (
                            hospital.name
                          )}
                          {hospital.address ? ` — ${hospital.address}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <form className="chat-composer" onSubmit={sendMessage}>
        <div className="chat-location-fields">
          <input
            className="form-input"
            aria-label="City (optional)"
            placeholder="City (optional)"
            value={city}
            onChange={(event) =>
              setLocation({ sessionId, city: event.target.value, country })
            }
            disabled={!sessionId || isSending}
          />
          <input
            className="form-input"
            aria-label="Country (optional)"
            placeholder="Country (optional)"
            value={country}
            onChange={(event) =>
              setLocation({ sessionId, city, country: event.target.value })
            }
            disabled={!sessionId || isSending}
          />
        </div>
        <div className="chat-message-fields">
          <textarea
            className="form-input chat-message-input"
            aria-label="Your message"
            placeholder={
              sessionId ? "Write a message..." : "Create or select a chat first"
            }
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={
              !sessionId ||
              isSending ||
              isLoadingMessages ||
              showMessagesError
            }
            rows={2}
          />
          <button
            className="btn chat-send-button"
            type="submit"
            disabled={
              !sessionId ||
              isSending ||
              isLoadingMessages ||
              showMessagesError
            }
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
        {errors.message && (
          <p className="chat-form-error">{errors.message}</p>
        )}
      </form>
    </main>
  );
}

export default ChatConversation;
