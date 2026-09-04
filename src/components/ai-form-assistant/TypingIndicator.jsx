import { motion } from "framer-motion";
import "./TypingIndicator.css";

/**
 * Natural "AI is thinking" indicator. Deliberately generic — no backend
 * stage names, no fixed wait times. Shown for as long as `isThinking` is
 * true in the store, i.e. exactly as long as the real request is in
 * flight, per Step 2 Section 2 / 12.
 */
export default function TypingIndicator() {
  return (
    <div className="ai-chat-bubble ai-chat-bubble--assistant ai-typing">
      <span className="ai-typing__dot" />
      <span className="ai-typing__dot" />
      <span className="ai-typing__dot" />
    </div>
  );
}
