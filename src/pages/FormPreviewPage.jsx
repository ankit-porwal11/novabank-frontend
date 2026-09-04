import { useNavigate } from "react-router-dom";
import { useAiFormAssistantStore } from "../stores/aiFormAssistantStore.js";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import FormPreviewDocument from "../components/ai-form-assistant/FormPreviewDocument.jsx";
import "./FormPreviewPage.css";

/**
 * Temporary workspace (Step 2 Section 7). Shows the backend-provided
 * `previewHtml` returned directly by master-upload, save-field-answer,
 * or update-preview (all confirmed to return finalData + previewHtml
 * together once completed). The plain key/value rendering of `finalData`
 * is only a fallback for the rare case previewHtml is absent.
 *
 * Approve and Update both return to the SAME chat per the locked Step 2
 * requirement — neither creates a new conversation.
 */
export default function FormPreviewPage() {
  const navigate = useNavigate();
  const journeyId = useAiFormAssistantStore((s) => s.journeyId);
  const finalData = useAiFormAssistantStore((s) => s.finalData);
  const previewHtml = useAiFormAssistantStore((s) => s.previewHtml);
  const addMessage = useAiFormAssistantStore((s) => s.addMessage);
  const setStage = useAiFormAssistantStore((s) => s.setStage);

  if (!journeyId) {
    return (
      <div className="form-preview-page">
        <Card>
          <p>No active AI Form Assistant journey was found. Please start from the dashboard.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  function handleApprove() {
    // BACKEND / UX GAP (Step 3, gap #14): no distinct "approve" endpoint
    // was provided — the only remaining confirmed call in the journey is
    // POST /ai/form/download-pdf. Since there is no backend call to wait
    // on between "approved" and "ready to download", both are surfaced
    // together rather than showing a thinking indicator for a request
    // that doesn't actually happen (per the no-fake-waiting rule).
    addMessage({
      role: "assistant",
      kind: "text",
      text: "Great. I've received your approval. Your form is complete — everything looks good and your document is ready.",
    });
    addMessage({
      role: "assistant",
      kind: "action",
      actionId: "download",
      actionLabel: "Download Form",
      actionTo: null,
    });
    setStage("download-ready");
    navigate("/ai-form-assistant");
  }

  function handleUpdate() {
    navigate("/ai-form-assistant/update");
  }

  return (
    <div className="form-preview-page">
      <Card>
        <CardHeader title="Form Preview" subtitle="Review your details before finalizing." />

        {previewHtml ? (
          <FormPreviewDocument html={previewHtml} />
        ) : finalData ? (
          <dl className="form-preview-page__fallback">
            {Object.entries(finalData).map(([key, value]) => (
              <div className="form-preview-page__row" key={key}>
                <dt>{key}</dt>
                <dd>{typeof value === "object" ? JSON.stringify(value) : String(value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted">No preview data is available for this journey yet.</p>
        )}

        <div className="form-preview-page__footer">
          <Button variant="secondary" onClick={handleUpdate}>
            Update
          </Button>
          <Button onClick={handleApprove}>Save / Approve</Button>
        </div>
      </Card>
    </div>
  );
}