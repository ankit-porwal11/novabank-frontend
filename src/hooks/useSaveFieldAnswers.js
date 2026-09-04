import { useMutation } from "@tanstack/react-query";
import { saveFieldAnswers } from "../api/aiFormAssistant.api.js";

// POST /ai/form/save-field-answer
export function useSaveFieldAnswers() {
  return useMutation({
    mutationFn: saveFieldAnswers,
  });
}
