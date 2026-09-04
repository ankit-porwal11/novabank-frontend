import { useMutation } from "@tanstack/react-query";
import { updateFormPreview } from "../api/aiFormAssistant.api.js";

// PUT /ai/form/update-preview
export function useUpdateFormPreview() {
  return useMutation({
    mutationFn: updateFormPreview,
  });
}
