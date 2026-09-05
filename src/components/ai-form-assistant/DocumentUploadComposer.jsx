import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./DocumentUploadComposer.css";


const DOCUMENT_TYPE_MAP = {
  "Aadhaar Card": "AADHAAR",
  "PAN Card": "PAN",
  "Passbook": "PASSBOOK",
  "Other": "OTHER",
   "Nominee ID Proof": "OTHER",
};

/**
 * Inline document upload control shown in the chat once the AI has asked
 * for a document.
 *
 * POST /ai/document/master-upload requires a `documentType` text field.
 * Fresh Postman testing confirms `requiredDocuments` (from /chat/message
 * and /ai/form/start) is populated with the actual document names for a
 * given form (e.g. "PAN Card", "Aadhaar Card"), so those are offered as
 * selectable options. If `requiredDocuments` is empty for a given form
 * (still possible per earlier testing), a free-text field is used as a
 * fallback so upload remains possible either way.
 */
export default function DocumentUploadComposer({ onUpload, disabled, requiredDocuments = [] }) {
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // useEffect(() => {
  //   if (requiredDocuments.length > 0) {
  //     setDocumentType(requiredDocuments[0]);
  //   }
  // }, [requiredDocuments]);

  useEffect(() => {
  if (requiredDocuments.length > 0) {
    const firstDocument = requiredDocuments[0];
    setDocumentType(DOCUMENT_TYPE_MAP[firstDocument] || firstDocument);
  }
}, [requiredDocuments]);

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file || !documentType.trim() || disabled) return;
    onUpload({ documentType: documentType.trim(), file });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form className="ai-doc-upload" onSubmit={handleSubmit}>
      {requiredDocuments.length > 0 ? (
        <select
          className="ai-doc-upload__type ai-doc-upload__type--select"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={disabled}
        >
          {/* {requiredDocuments.map((doc) => (
            <option key={doc} value={doc}>
              {doc}
            </option>
          ))} */}
          {requiredDocuments.map((doc) => (
  <option key={doc} value={DOCUMENT_TYPE_MAP[doc] || doc}>
    {doc}
  </option>
))}
        </select>
      ) : (
        <input
          type="text"
          className="ai-doc-upload__type"
          placeholder="Document type (e.g. AADHAAR)"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={disabled}
        />
      )}

      <button
        type="button"
        className="ai-doc-upload__attach"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip size={16} />
        <span>{file ? file.name : "Choose file"}</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="ai-doc-upload__file-input"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <Button type="submit" size="sm" disabled={disabled || !file || !documentType.trim()}>
        Upload
      </Button>
    </form>
  );
}
