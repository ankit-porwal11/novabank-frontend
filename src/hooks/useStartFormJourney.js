import { useMutation } from "@tanstack/react-query";
import { startFormJourney } from "../api/aiFormAssistant.api.js";

// POST /ai/form/start
export function useStartFormJourney() {
  return useMutation({
    mutationFn: startFormJourney,
  });
}
