import { useState } from "react";
import { Send } from "lucide-react";
import "./ChatComposer.css";

export default function ChatComposer({ onSend, disabled, placeholder = "Type your request…" }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form className="ai-chat-composer" onSubmit={handleSubmit}>
      <input
        type="text"
        className="ai-chat-composer__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        className="ai-chat-composer__send"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
