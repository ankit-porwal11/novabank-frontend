import axiosClient from "./axiosClient.js";

/**
 * AI Form Assistant API — mirrors the actual Postman-tested endpoints
 * provided and analyzed in Step 3. Only these six calls exist; nothing
 * here is invented. Request/response shapes match exactly what was
 * confirmed. Where a response field's presence is uncertain for a given
 * case (e.g. the "missing fields" branch of master-upload, whose success
 * shape was never demonstrated), the raw response is returned as-is and
 * the caller is responsible for handling it defensively — see
 * stores/aiFormAssistantStore.js and pages/MissingFieldsPage.jsx for the
 * BACKEND / UX GAP notes on that branch.
 */

// POST /chat/message
// Body: { message }
// Response: { success, formId, formType, formName, requiredDocuments, message }
export async function sendChatMessage({ message }) {
  const response = await axiosClient.post("/chat/message", { message });
  return response.data;
}

// POST /ai/form/start
// Body: { formTemplateId }
// Response: { success, journeyId, requiredDocuments }
export async function startFormJourney({ formTemplateId }) {
  const response = await axiosClient.post("/ai/form/start", { formTemplateId });
  return response.data;
}

// POST /ai/document/master-upload  (multipart/form-data)
// Fields: journeyId (text), documentType (text), document (file)
// Response (completed case, confirmed):
//   { success, completed: true, journeyId, finalData, previewHtml }
// The completed:false / missing-fields response shape was never provided
// (Step 3, gap #1) — this function just returns whatever the backend
// sends back; the caller must not assume a specific field name for
// missing-field data.
export async function uploadMasterDocument({ journeyId, documentType, file }) {
  const formData = new FormData();
  formData.append("journeyId", journeyId);
  formData.append("documentType", documentType);
  formData.append("document", file);

  // Content-Type is intentionally NOT set manually here — the browser/axios
  // needs to generate it itself (including the multipart boundary) from the
  // FormData instance. Setting "multipart/form-data" explicitly without a
  // boundary breaks parsing on the backend.
  const response = await axiosClient.post("/ai/document/master-upload", formData);
  return response.data;
}

// POST /ai/form/save-field-answer
// Body: { journeyId, answers }
// Response shape was not provided in Step 3 — only that a save occurs.
export async function saveFieldAnswers({ journeyId, answers }) {
  const response = await axiosClient.post("/ai/form/save-field-answer", {
    journeyId,
    answers,
  });
  return response.data;
}

// PUT /ai/form/update-preview
// Body: { journeyId, updates }
// Response shape was not provided in Step 3 beyond "a success response is
// received" — the caller must not assume updated finalData/previewHtml
// come back on this call.
export async function updateFormPreview({ journeyId, updates }) {
  const response = await axiosClient.put("/ai/form/update-preview", {
    journeyId,
    updates,
  });
  return response.data;
}

// POST /ai/form/download-pdf
// Body: { journeyId }
// Response format (binary / JSON with a file reference / base64) was not
// confirmed in Step 3. Requested as a blob defensively so a binary PDF
// response can be turned into a browser download; if the backend instead
// returns JSON, the blob will have type "application/json" and the
// caller (hooks/useDownloadFormPdf.js) inspects it before deciding how to
// proceed, rather than assuming one specific format.
export async function downloadFormPdf({ journeyId }) {
  const response = await axiosClient.post(
    "/ai/form/download-pdf",
    { journeyId },
    { responseType: "blob" }
  );
  return response.data;
}
