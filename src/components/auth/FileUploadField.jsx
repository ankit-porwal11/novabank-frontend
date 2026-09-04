import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import SuccessCheck from "../ui/SuccessCheck.jsx";
import "./FileUploadField.css";

/**
 * FileUploadField — click-to-browse image picker with an animated preview
 * reveal and a brief success flash on selection. `onChange(file|null)`
 * contract is unchanged — purely a visual upgrade.
 * `shape`: "circle" (avatar) | "banner" (cover image)
 */
export default function FileUploadField({
  label,
  shape = "circle",
  onChange,
  error,
  required = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [justSelected, setJustSelected] = useState(false);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    onChange?.(file);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 1400);
  }

  function handleClear(e) {
    e.stopPropagation();
    setPreviewUrl(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  }

  return (
    <div className="upload-field">
      {label && (
        <label className="upload-field__label">
          {label} {required && <span className="upload-field__required">*</span>}
        </label>
      )}
      <motion.div
        className={`upload-field__dropzone upload-field__dropzone--${shape} ${
          error ? "upload-field__dropzone--error" : ""
        }`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <img src={previewUrl} alt="" className="upload-field__preview" />
              <AnimatePresence>
                {justSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="upload-field__success-overlay"
                  >
                    <SuccessCheck size={shape === "circle" ? 26 : 22} />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                className="upload-field__clear"
                onClick={handleClear}
                aria-label="Remove selected file"
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="upload-field__placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UploadCloud size={20} strokeWidth={1.75} />
              <span>Click to upload</span>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="upload-field__input"
          onChange={handleFileSelect}
        />
      </motion.div>
      {fileName && <p className="upload-field__filename">{fileName}</p>}
      {error && <p className="upload-field__error">{error}</p>}
    </div>
  );
}
