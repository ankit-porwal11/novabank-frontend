import { useMutation } from "@tanstack/react-query";
import { downloadFormPdf } from "../api/aiFormAssistant.api.js";

/**
 * POST /ai/form/download-pdf
 *
 * Confirmed by fresh Postman testing: the backend generates a real PDF
 * for the journey (visible server-side under Backend/uploads/) and
 * Postman's response panel shows a PDF preview for a 200 response — i.e.
 * the endpoint returns the actual PDF file, not a JSON wrapper. This hook
 * requests the response as a blob and downloads it directly as a file.
 *
 * The exact Content-Type header sent by the backend wasn't spelled out in
 * testing, so as a safety net the blob's reported type is still checked:
 * if it's ever JSON instead of a binary file, the response is parsed and
 * returned as data rather than silently failing the download. This is a
 * defensive fallback only — the confirmed, expected path is the binary
 * file branch below.
 */
async function downloadAndSave({ journeyId }) {
  const blob = await downloadFormPdf({ journeyId });

  const contentType = blob.type || "";

  if (contentType.includes("application/json")) {
    // Response was JSON, not a binary file — we cannot assume what field
    // holds the actual file reference. Surface the parsed body to the
    // caller instead of guessing.
    const text = await blob.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    return { kind: "json", data: parsed, raw: text };
  }

  // Treat anything else (application/pdf or an unlabeled binary blob) as
  // the downloadable file itself.
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "form.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);

  return { kind: "file" };
}

export function useDownloadFormPdf() {
  return useMutation({
    mutationFn: downloadAndSave,
  });
}
