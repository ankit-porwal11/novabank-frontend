/**
 * Parses the confirmed `missingFields` array from POST
 * /ai/document/master-upload and POST /ai/form/save-field-answer when
 * `completed` is false.
 *
 * Confirmed shape (fresh Postman testing):
 *   missingFields: [
 *     { fieldName, sourceKey, fieldType, options }
 *   ]
 *   totalMissing: number
 *
 * `sourceKey` is the exact key the backend expects back in the `answers`
 * object of POST /ai/form/save-field-answer (confirmed by the save
 * request body using the same sourceKey strings, e.g. "Branch:",
 * "Account No.", as its answer keys). `fieldName` is the human-readable
 * label. `fieldType` was only ever observed as "TEXT" in testing;
 * `options` was only ever observed as an empty array. Both are read
 * defensively (a non-empty `options` renders a select) since a
 * populated example was never shown, but the field list itself is no
 * longer guessed — it comes directly from the backend.
 */
export function parseMissingFields(response) {
  if (!response || !Array.isArray(response.missingFields)) return [];
  return response.missingFields.map((field) => ({
    fieldName: field.fieldName,
    sourceKey: field.sourceKey,
    fieldType: field.fieldType || "TEXT",
    options: Array.isArray(field.options) ? field.options : [],
  }));
}

