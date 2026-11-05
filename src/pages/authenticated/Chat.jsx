import { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ChatConversation from "../../components/chat/ChatConversation";
import { AuthContent } from "../../stores/AuthStore";

function Chat() {
  const { sectionId } = useParams();
  const { user } = useContext(AuthContent);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleSessionTitleChange = useCallback((sessionId, title) => {
    if (sessionId === sectionId) {
      setSessionTitle(title);
    }
  }, [sectionId]);

  return (
    <div className="chat-dashboard chat-session-page">
      <ChatConversation
        sessionId={sectionId}
        username={user?.username}
        sessionTitle={sessionTitle}
        onSessionTitleChange={handleSessionTitleChange}
        isSendingMessage={isSendingMessage}
        setIsSendingMessage={setIsSendingMessage}
      />
    </div>
  );
}

export default Chat;
