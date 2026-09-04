import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAiFormAssistantStore } from "../stores/aiFormAssistantStore.js";
import { useUpdateFormPreview } from "../hooks/useUpdateFormPreview.js";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { notify } from "../lib/toast.js";
import "./EditableUpdateFormPage.css";

const FRIENDLY_ERROR = "I'm sorry, but I'm having trouble processing your request right now. Please try again later.";

/**
 * Temporary workspace (Step 2 Section 9). Pre-populates every field from
 * the journey's current finalData and lets the user edit any of them.
 * On save, only the fields that actually changed are sent as `updates`
 * to PUT /ai/form/update-preview — matching the shape of the confirmed
 * Postman example (a subset of changed fields), not the entire record.
 */
export default function EditableUpdateFormPage() {
  const navigate = useNavigate();
  const journeyId = useAiFormAssistantStore((s) => s.journeyId);
  const finalData = useAiFormAssistantStore((s) => s.finalData);
  const addMessage = useAiFormAssistantStore((s) => s.addMessage);
  const setStage = useAiFormAssistantStore((s) => s.setStage);
  const setSubmittedUpdates = useAiFormAssistantStore((s) => s.setSubmittedUpdates);
  const applyFinalData = useAiFormAssistantStore((s) => s.applyFinalData);

  const updateFormPreview = useUpdateFormPreview();

  const [values, setValues] = useState(() => ({ ...(finalData || {}) }));

  if (!journeyId) {
    return (
      <div className="editable-update-page">
        <Card>
          <p>No active AI Form Assistant journey was found. Please start from the dashboard.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  if (!finalData) {
    return (
      <div className="editable-update-page">
        <Card>
          <p>There's no form data available to edit yet for this journey.</p>
          <Button onClick={() => navigate("/ai-form-assistant")}>Back to Chat</Button>
        </Card>
      </div>
    );
  }

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();

    const updates = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== finalData[key]) {
        updates[key] = values[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      navigate("/ai-form-assistant");
      return;
    }

    try {
      const response = await updateFormPreview.mutateAsync({ journeyId, updates });
      setSubmittedUpdates(updates);

      // Confirmed shape (fresh Postman testing):
      // { success, message, journeyId, finalData, previewHtml }
      // Applied directly — no client-side merge/guessing.
      applyFinalData({ finalData: response.finalData, previewHtml: response.previewHtml });

      addMessage({
        role: "assistant",
        kind: "text",
        text: "Got it. I've saved your changes. Let me update the final version of your form.",
      });
      addMessage({
        role: "assistant",
        kind: "text",
        text: "Your form is complete. Everything looks good and your document is ready.",
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
    } catch {
      notify.error(FRIENDLY_ERROR);
    }
  }

  return (
    <div className="editable-update-page">
      <Card>
        <CardHeader title="Update Your Form" subtitle="Edit any details that need correcting." />

        <form onSubmit={handleSave} className="editable-update-form">
          <div className="editable-update-form__grid">
            {Object.keys(finalData)
              .filter((key) => typeof finalData[key] !== "object")
              .map((key) => (
                <Input
                  key={key}
                  label={key}
                  value={values[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ))}
          </div>

          <div className="editable-update-form__footer">
            <Button type="submit" isLoading={updateFormPreview.isPending} fullWidth>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
