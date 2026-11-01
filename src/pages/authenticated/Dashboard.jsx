import { useCallback, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatConversation from "../../components/chat/ChatConversation";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { AuthContent } from "../../stores/AuthStore";

function Dashboard() {
  const { user } = useContext(AuthContent);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionTitles, setSessionTitles] = useState({});
  const [sessionUpdates, setSessionUpdates] = useState({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSessionsLoaded, setIsSessionsLoaded] = useState(false);
  const activeSessionId = sessionId ?? "";

  const handleSessionCreated = useCallback((session) => {
    setSessionTitles((currentTitles) => ({
      ...currentTitles,
      [session.sessionId]: "New chat",
    }));
    navigate(`/dashboard/${session.sessionId}`);
    setIsSidebarOpen(false);
  }, [navigate]);

  const handleSelectSession = useCallback((sessionId) => {
    navigate(`/dashboard/${sessionId}`);
    setIsSidebarOpen(false);
  }, [navigate]);

  const handleSessionTitleChange = useCallback((sessionId, title) => {
    setSessionTitles((currentTitles) => ({
      ...currentTitles,
      [sessionId]: title,
    }));
  }, []);

  const handleSessionUpdated = useCallback((sessionId, updatedAt) => {
    setSessionUpdates((currentUpdates) => ({
      ...currentUpdates,
      [sessionId]: updatedAt,
    }));
  }, []);

  const handleSessionsLoaded = useCallback(() => {
    setIsSessionsLoaded(true);
  }, []);

  return (
    <div className="chat-dashboard">
      <ChatSidebar
        activeSessionId={activeSessionId}
        sessionTitles={sessionTitles}
        sessionUpdates={sessionUpdates}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectSession={handleSelectSession}
        onSessionCreated={handleSessionCreated}
        onSessionsLoaded={handleSessionsLoaded}
        isSendingMessage={isSendingMessage}
      />
      <ChatConversation
        sessionId={isSessionsLoaded ? activeSessionId : ""}
        username={user?.username}
        sessionTitle={sessionTitles[activeSessionId]}
        onSessionTitleChange={handleSessionTitleChange}
        onSessionUpdated={handleSessionUpdated}
        isSendingMessage={isSendingMessage}
        setIsSendingMessage={setIsSendingMessage}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
      {isSidebarOpen && (
        <button
          className="chat-sidebar-backdrop"
          aria-label="Close chat menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
