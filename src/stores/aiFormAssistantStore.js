import { create } from "zustand";

/**
 * AI Form Assistant journey/chat store.
 *
 * This is the mechanism that satisfies the Step 2 locked requirement:
 * "the user must always return to the exact same ongoing chat" after
 * visiting the Missing Fields / Form Preview / Editable Update pages.
 *
 * Because this is a module-level Zustand store (not component state), it
 * survives route navigation within the SPA session automatically — moving
 * from the chat route to a temporary-page route and back does not remount
 * or reset this store, so `messages` and all journey identifiers stay
 * exactly as they were.
 *
 * Scope note (Step 3 gap #6/#7): there is no backend endpoint to persist
 * or rehydrate a journey/conversation, so this store is in-memory only —
 * it does not survive a full page reload or a new browser session. That
 * is an explicit, flagged limitation, not an invented behavior; see the
 * implementation report for details.
 *
 * Message shape:
 *   {
 *     id: string,
 *     role: "user" | "assistant",
 *     kind: "text" | "upload" | "action" | "error",
 *     text?: string,
 *     fileName?: string,          // kind: "upload"
 *     actionLabel?: string,       // kind: "action"
 *     actionTo?: string,          // kind: "action" — route to navigate to
 *     createdAt: number,
 *   }
 */

let messageCounter = 0;
function nextMessageId() {
  messageCounter += 1;
  return `msg_${Date.now()}_${messageCounter}`;
}

export const useAiFormAssistantStore = create((set, get) => ({
  // ---- Identifiers carried through the journey (Step 3) ----
  formId: null,
  formType: null,
  formName: null,
  requiredDocuments: [],
  journeyId: null,

  // ---- Data returned once the document is processed ----
  completed: null, // null = unknown yet, true/false once master-upload/save-field-answer responds
  finalData: null,
  previewHtml: null,

  // Confirmed shape (fresh Postman testing) of the "fields missing"
  // response from master-upload / save-field-answer:
  //   missingFields: [{ fieldName, sourceKey, fieldType, options }]
  //   totalMissing: number
  missingFields: [],
  totalMissing: 0,

  // What the user has submitted, kept for state-preservation/reference.
  submittedAnswers: null,
  submittedUpdates: null,

  // ---- Chat state ----
  messages: [],
  isThinking: false,

  // ---- High-level journey stage, used to know what to render/resume ----
  // "idle" | "awaiting-document" | "processing" | "missing-fields-ready" |
  // "preview-ready" | "updating" | "download-ready" | "done" | "error"
  stage: "idle",
  errorMessage: null,

  // ---- Actions ----
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: nextMessageId(), createdAt: Date.now(), ...message },
      ],
    })),

  setThinking: (value) => set({ isThinking: value }),

  setStage: (stage) => set({ stage }),

  setChatIdentifiers: ({ formId, formType, formName, requiredDocuments }) =>
    set({ formId, formType, formName, requiredDocuments: requiredDocuments || [] }),

  setJourneyId: (journeyId) => set({ journeyId }),

  setUploadResult: ({ completed, finalData, previewHtml, missingFields, totalMissing }) =>
    set({
      completed,
      finalData: finalData ?? null,
      previewHtml: previewHtml ?? null,
      missingFields: Array.isArray(missingFields) ? missingFields : [],
      totalMissing: totalMissing ?? 0,
    }),

  /** Applies the confirmed finalData/previewHtml returned directly by the
   * backend (master-upload completed:true, save-field-answer completed:true,
   * or update-preview) — no client-side merge/guessing involved. */
  applyFinalData: ({ finalData, previewHtml }) =>
    set((state) => ({
      finalData: finalData ?? state.finalData,
      previewHtml: previewHtml ?? state.previewHtml,
    })),

  setSubmittedAnswers: (answers) => set({ submittedAnswers: answers }),

  setSubmittedUpdates: (updates) => set({ submittedUpdates: updates }),

  setError: (message) => set({ errorMessage: message, stage: "error" }),
  clearError: () => set({ errorMessage: null }),

  /** Resets the journey. Only ever called from an explicit user action
   * (e.g. leaving the assistant / starting over) — never automatically,
   * per Step 2's instruction not to assume new-vs-resumed-chat behavior. */
  resetJourney: () =>
    set({
      formId: null,
      formType: null,
      formName: null,
      requiredDocuments: [],
      journeyId: null,
      completed: null,
      finalData: null,
      previewHtml: null,
      missingFields: [],
      totalMissing: 0,
      submittedAnswers: null,
      submittedUpdates: null,
      messages: [],
      isThinking: false,
      stage: "idle",
      errorMessage: null,
    }),

  hasActiveJourney: () => Boolean(get().journeyId),
}));
