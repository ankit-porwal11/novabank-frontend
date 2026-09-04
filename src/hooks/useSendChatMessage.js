import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/aiFormAssistant.api.js";

// POST /chat/message
export function useSendChatMessage() {
  return useMutation({
    mutationFn: sendChatMessage,
  });
}
