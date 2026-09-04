import { useMutation } from "@tanstack/react-query";
import { uploadMasterDocument } from "../api/aiFormAssistant.api.js";

// POST /ai/document/master-upload (multipart/form-data)
export function useUploadMasterDocument() {
  return useMutation({
    mutationFn: uploadMasterDocument,
  });
}
