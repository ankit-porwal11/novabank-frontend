import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAiFormAssistantStore } from "../stores/aiFormAssistantStore.js";
import { useSaveFieldAnswers } from "../hooks/useSaveFieldAnswers.js";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { notify } from "../lib/toast.js";
import "./MissingFieldsPage.css";

const FRIENDLY_ERROR = "I'm sorry, but I'm having trouble processing your request right now. Please try again later.";

/**
 * Temporary workspace (Step 2 Section 6). Renders the confirmed
 * `missingFields[]` structure from POST /ai/document/master-upload /
 * POST /ai/form/save-field-answer directly:
 *   { fieldName, sourceKey, fieldType, options }
 *
 * `sourceKey` is the exact answer key the backend expects back (confirmed
 * by the actual save-field-answer request bodies in testing). `fieldName`
 * is shown as the label. A field with a non-empty `options` array is
 * rendered as a select; otherwise it's a text input (fieldType has only
 * ever been observed as "TEXT").
 *
 * save-field-answer can itself come back with completed:false and a new,
 * smaller missingFields[] list (confirmed by testing — the flow looped
 * twice: 33 missing, then 2 remaining, then completed:true). This page
 * handles that by re-rendering with the newly returned fields rather than
 * assuming one round is always enough.
 */
export default function MissingFieldsPage() {
  const navigate = useNavigate();
  const journeyId = useAiFormAssistantStore((s) => s.journeyId);
  const missingFields = useAiFormAssistantStore((s) => s.missingFields);
  const addMessage = useAiFormAssistantStore((s) => s.addMessage);
  const setStage = useAiFormAssistantStore((s) => s.setStage);
  const setSubmittedAnswers = useAiFormAssistantStore((s) => s.setSubmittedAnswers);
  const setUploadResult = useAiFormAssistantStore((s) => s.setUploadResult);

  const saveFieldAnswers = useSaveFieldAnswers();

  const [values, setValues] = useState(() => {
    const initial = {};
    (missingFields || []).forEach((field) => {
      initial[field.sourceKey] = "";
    });
    return initial;
  });

  if (!journeyId) {
    return (
      <div className="missing-fields-page">
        <Card>
          <p>No active AI Form Assistant journey was found. Please start from the dashboard.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  function handleChange(sourceKey, value) {
    setValues((prev) => ({ ...prev, [sourceKey]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();

    // Only send answers for fields actually shown on this page, keyed by
    // the exact sourceKey the backend expects.
    const answers = {};
    (missingFields || []).forEach((field) => {
      answers[field.sourceKey] = values[field.sourceKey] ?? "";
    });

    try {
      const response = await saveFieldAnswers.mutateAsync({ journeyId, answers });
      setSubmittedAnswers(answers);

      if (response.completed === true) {
        // Confirmed: completed:true comes with finalData + previewHtml.
        setUploadResult({
          completed: true,
          finalData: response.finalData,
          previewHtml: response.previewHtml,
        });

        addMessage({
          role: "assistant",
          kind: "text",
          text: "Thanks. I've received the additional information. Let me complete your form.",
        });
        addMessage({
          role: "assistant",
          kind: "text",
          text: "Your form is ready for review. Please check your details before finalizing.",
        });
        addMessage({
          role: "assistant",
          kind: "action",
          actionId: "view-preview",
          actionLabel: "View Form Preview",
          actionTo: "/ai-form-assistant/preview",
        });
        setStage("preview-ready");
      } else {
        // Confirmed: completed:false comes back with a new (typically
        // smaller) missingFields[] list — another round is required.
        setUploadResult({
          completed: false,
          missingFields: response.missingFields,
          totalMissing: response.totalMissing,
        });

        addMessage({
          role: "assistant",
          kind: "text",
          text: "Thanks. I've received that. I still need a few more details to complete your form.",
        });
        addMessage({
          role: "assistant",
          kind: "action",
          actionId: "check-missing-fields",
          actionLabel: "Check Your Missing Fields",
          actionTo: "/ai-form-assistant/missing-fields",
        });
        setStage("missing-fields-ready");
      }

      navigate("/ai-form-assistant");
    } catch {
      notify.error(FRIENDLY_ERROR);
    }
  }

  return (
    <div className="missing-fields-page">
      <Card>
        <CardHeader
          title="Complete Your Form"
          subtitle={
            missingFields?.length
              ? `Please fill in ${missingFields.length} remaining detail${missingFields.length > 1 ? "s" : ""}.`
              : "Please fill in the remaining details to continue."
          }
        />

        <form onSubmit={handleSave} className="missing-fields-form">
          {(missingFields || []).map((field) =>
            field.options && field.options.length > 0 ? (
              <div className="missing-fields-select" key={field.sourceKey}>
                <label className="missing-fields-select__label">{field.fieldName}</label>
                <select
                  className="missing-fields-select__control"
                  value={values[field.sourceKey] ?? ""}
                  onChange={(e) => handleChange(field.sourceKey, e.target.value)}
                >
                  <option value="" disabled>
                    Select {field.fieldName}
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Input
                key={field.sourceKey}
                label={field.fieldName}
                value={values[field.sourceKey] ?? ""}
                onChange={(e) => handleChange(field.sourceKey, e.target.value)}
              />
            )
          )}

          <div className="missing-fields-footer">
            <Button type="submit" isLoading={saveFieldAnswers.isPending} fullWidth>
              Save & Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
