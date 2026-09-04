import { useEffect, useRef } from "react";
import ChatMessageBubble from "./ChatMessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import "./ChatMessageList.css";

export default function ChatMessageList({ messages, isThinking, onAction, downloadLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking]);

  return (
    <div className="ai-chat-list">
      {messages.map((message) => (
        <ChatMessageBubble
          key={message.id}
          message={message}
          onAction={onAction}
          actionLoading={message.actionId === "download" && downloadLoading}
        />
      ))}
      {isThinking && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
