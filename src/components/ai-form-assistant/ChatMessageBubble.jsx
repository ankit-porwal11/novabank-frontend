import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, AlertTriangle } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./ChatMessageBubble.css";

/**
 * Renders one message in the AI Form Assistant conversation.
 * kind: "text" | "upload" | "action" | "error"
 *
 * Action messages carry an `actionId` (e.g. "view-preview",
 * "check-missing-fields", "download", "retry-upload") and, when the
 * action is a simple route change, an `actionTo` path. If `actionTo` is
 * present the bubble navigates directly; otherwise it defers to the
 * parent page's `onAction` handler (used for actions that trigger a real
 * API call, like "download", rather than a route change).
 */
export default function ChatMessageBubble({ message, onAction, actionLoading }) {
  const navigate = useNavigate();
  const isUser = message.role === "user";

  function handleActionClick() {
    if (message.actionTo) {
      navigate(message.actionTo);
    } else {
      onAction?.(message.actionId, message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`ai-chat-row ${isUser ? "ai-chat-row--user" : "ai-chat-row--assistant"}`}
    >
      {message.kind === "upload" ? (
        <div className={`ai-chat-bubble ai-chat-bubble--${isUser ? "user" : "assistant"} ai-chat-bubble--upload`}>
          <FileText size={16} />
          <span>{message.fileName || "Uploaded document"}</span>
        </div>
      ) : message.kind === "error" ? (
        <div className="ai-chat-bubble ai-chat-bubble--assistant ai-chat-bubble--error">
          <AlertTriangle size={16} />
          <span>{message.text}</span>
        </div>
      ) : (
        <div className={`ai-chat-bubble ai-chat-bubble--${isUser ? "user" : "assistant"}`}>
          {message.text}
        </div>
      )}

      {message.kind === "action" && (
        <div className="ai-chat-action">
          <Button size="sm" isLoading={actionLoading} onClick={handleActionClick}>
            {message.actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
