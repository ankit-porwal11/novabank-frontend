import { useEffect, useRef } from "react";
import { useAiFormAssistantStore } from "../stores/aiFormAssistantStore.js";
import { useSendChatMessage } from "../hooks/useSendChatMessage.js";
import { useStartFormJourney } from "../hooks/useStartFormJourney.js";
import { useUploadMasterDocument } from "../hooks/useUploadMasterDocument.js";
import { useDownloadFormPdf } from "../hooks/useDownloadFormPdf.js";
import ChatMessageList from "../components/ai-form-assistant/ChatMessageList.jsx";
import ChatComposer from "../components/ai-form-assistant/ChatComposer.jsx";
import DocumentUploadComposer from "../components/ai-form-assistant/DocumentUploadComposer.jsx";
import Card from "../components/ui/Card.jsx";
import "./AiFormAssistantPage.css";

const FRIENDLY_ERROR =
  "I'm sorry, but I'm having trouble processing your request right now. Please try again later.";
const UNREADABLE_DOC_ERROR =
  "I couldn't read this document clearly. Please upload a clearer file and I'll try again.";

/**
 * The permanent AI Form Assistant conversation (Step 2's "core UX rule").
 * All journey state lives in useAiFormAssistantStore, so navigating away
 * to the Missing Fields / Preview / Update pages and back does not reset
 * anything rendered here — see stores/aiFormAssistantStore.js.
 */
export default function AiFormAssistantPage() {
  const store = useAiFormAssistantStore();
  const {
    messages,
    isThinking,
    stage,
    journeyId,
    requiredDocuments,
    addMessage,
    setThinking,
    setStage,
    setChatIdentifiers,
    setJourneyId,
    setUploadResult,
  } = store;

  const sendChatMessage = useSendChatMessage();
  const startFormJourney = useStartFormJourney();
  const uploadDocument = useUploadMasterDocument();
  const downloadPdf = useDownloadFormPdf();

  const greeted = useRef(false);

  // Initial greeting — only added once, and only if this is genuinely a
  // fresh journey (no messages yet). Whether a brand-new visit should
  // instead resume a prior journey is an open question (Step 2/3 gap) —
  // this only avoids re-greeting on every remount within the same
  // in-memory session.
  useEffect(() => {
    if (!greeted.current && messages.length === 0) {
      greeted.current = true;
      addMessage({
        role: "assistant",
        kind: "text",
        text: "Hi! Tell me what you'd like to do — for example, \"I want to open a bank account.\"",
      });
    }
  }, [messages.length, addMessage]);

  async function handleSendMessage(text) {
    addMessage({ role: "user", kind: "text", text });
    setThinking(true);
    try {
      const response = await sendChatMessage.mutateAsync({ message: text });
      setChatIdentifiers({
        formId: response.formId,
        formType: response.formType,
        formName: response.formName,
        requiredDocuments: response.requiredDocuments,
      });
      addMessage({
        role: "assistant",
        kind: "text",
        text: response.message || "Please upload the required document and I'll check it for you.",
      });

      // Per the approved Step 2/3 flow: formId is immediately used to
      // start the journey so journeyId is ready before the user uploads
      // anything. This bridging call is plumbing, not a user-facing chat
      // step, so no separate chat message is added for it.
      try {
        const startResponse = await startFormJourney.mutateAsync({
          formTemplateId: response.formId,
        });
        setJourneyId(startResponse.journeyId);
        setStage("awaiting-document");
      } catch {
        addMessage({ role: "assistant", kind: "error", text: FRIENDLY_ERROR });
      }
    } catch {
      // Stays on "idle" (composer remains visible) so the user can simply
      // retype/retry — no separate error stage needed for this step.
      addMessage({ role: "assistant", kind: "error", text: FRIENDLY_ERROR });
    } finally {
      setThinking(false);
    }
  }

  async function handleUploadDocument({ documentType, file }) {
    addMessage({ role: "user", kind: "upload", fileName: file.name });
    addMessage({ role: "assistant", kind: "text", text: "Got it. I've received your document. Let me check it for you." });
    setThinking(true);
    try {
      const response = await uploadDocument.mutateAsync({ journeyId, documentType, file });

      if (response.completed === true) {
        setUploadResult({
          completed: true,
          finalData: response.finalData,
          previewHtml: response.previewHtml,
        });
        addMessage({
          role: "assistant",
          kind: "text",
          text: "Your form is ready for review. Please check all the details before finalizing it.",
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
        // Confirmed shape (fresh Postman testing): completed:false comes
        // with missingFields[] ({fieldName, sourceKey, fieldType, options})
        // and totalMissing.
        setUploadResult({
          completed: false,
          missingFields: response.missingFields,
          totalMissing: response.totalMissing,
        });
        addMessage({
          role: "assistant",
          kind: "text",
          text:
            "I've checked your document. Most of the information has been filled successfully, but I still need a few more details to complete your form.",
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
    } catch (error) {
      const isUnreadable = error?.response?.status === 422 || error?.response?.status === 400;
      addMessage({
        role: "assistant",
        kind: "error",
        text: isUnreadable ? UNREADABLE_DOC_ERROR : FRIENDLY_ERROR,
      });
      setStage("awaiting-document");
    } finally {
      setThinking(false);
    }
  }

  async function handleAction(actionId) {
    if (actionId === "download") {
      setThinking(true);
      try {
        const result = await downloadPdf.mutateAsync({ journeyId });
        if (result.kind === "file") {
          addMessage({
            role: "assistant",
            kind: "text",
            text: "You're all set! Thank you for using AI Form Assistant.",
          });
          setStage("done");
        } else {
          // Defensive fallback only — download-pdf is confirmed to return
          // the actual PDF file (fresh Postman testing). This branch would
          // only trigger if the live response unexpectedly came back as
          // JSON instead.
          addMessage({
            role: "assistant",
            kind: "error",
            text: FRIENDLY_ERROR,
          });
        }
      } catch {
        addMessage({ role: "assistant", kind: "error", text: FRIENDLY_ERROR });
        addMessage({
          role: "assistant",
          kind: "action",
          actionId: "download",
          actionLabel: "Try Again",
          actionTo: null,
        });
      } finally {
        setThinking(false);
      }
    }
    // "view-preview" and "check-missing-fields" actions navigate via
    // ChatMessageBubble's Link-less Button + actionTo, handled by the
    // action button itself calling onAction then the router elsewhere —
    // see ChatMessageList/ChatMessageBubble wiring below.
  }

  const showUploadComposer = stage === "awaiting-document";
  const showTextComposer = stage === "idle";

  return (
    <div className="ai-assistant-page">
      <Card padding="none" className="ai-assistant-card">
        <ChatMessageList
          messages={messages}
          isThinking={isThinking}
          onAction={handleAction}
          downloadLoading={downloadPdf.isPending}
        />

        {showUploadComposer && (
          <DocumentUploadComposer
            onUpload={handleUploadDocument}
            disabled={isThinking}
            requiredDocuments={requiredDocuments}
          />
        )}
        {showTextComposer && (
          <ChatComposer onSend={handleSendMessage} disabled={isThinking} />
        )}
      </Card>
    </div>
  );
}
