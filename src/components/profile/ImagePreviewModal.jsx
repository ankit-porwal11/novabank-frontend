import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { createPortal } from "react-dom";
import Spinner from "../ui/Spinner.jsx";
import "./ImagePreviewModal.css";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Full-image preview for the profile avatar/cover — click to open, ESC or
 * backdrop click to close. Zoom/pan stays inside the modal so the page
 * never gains overflow. Rendered via a portal so parent transforms cannot
 * clip it.
 */
export default function ImagePreviewModal({ src, alt = "", label, open, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchStartRef = useRef(null);
  const dragRef = useRef(null);
  const didDragRef = useRef(false);
  const closeRef = useRef(null);

  const resetView = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomBy = useCallback((delta, origin) => {
    setScale((current) => {
      const next = clamp(current * delta, MIN_SCALE, MAX_SCALE);
      if (next <= MIN_SCALE) {
        setPan({ x: 0, y: 0 });
        return MIN_SCALE;
      }
      if (origin && stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        const cx = origin.x - rect.left - rect.width / 2;
        const cy = origin.y - rect.top - rect.height / 2;
        const ratio = next / current;
        setPan((p) => ({
          x: cx - (cx - p.x) * ratio,
          y: cy - (cy - p.y) * ratio,
        }));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setImageLoaded(false);
    resetView();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(1.18);
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(1 / 1.18);
      }
      if (e.key === "0") {
        e.preventDefault();
        resetView();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, src, resetView, zoomBy]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage) return undefined;
    function onWheel(e) {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomBy(factor, { x: e.clientX, y: e.clientY });
    }
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [open, zoomBy, imageLoaded]);

  function handlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    didDragRef.current = false;

    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinchStartRef.current = { distance: Math.hypot(dx, dy), scale };
      dragRef.current = null;
      return;
    }

    if (scale > 1) {
      dragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  }

  function handlePointerMove(e) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = [...pointersRef.current.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const distance = Math.hypot(dx, dy);
      const next = clamp(
        (pinchStartRef.current.scale * distance) / pinchStartRef.current.distance,
        MIN_SCALE,
        MAX_SCALE
      );
      setScale(next);
      if (next <= MIN_SCALE) setPan({ x: 0, y: 0 });
      didDragRef.current = true;
      return;
    }

    if (dragRef.current && scale > 1) {
      const next = { x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y };
      if (Math.abs(next.x - pan.x) > 2 || Math.abs(next.y - pan.y) > 2) {
        didDragRef.current = true;
      }
      setPan(next);
    }
  }

  function handlePointerUp(e) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) dragRef.current = null;
  }

  function handleBackdropClick() {
    if (didDragRef.current) return;
    onClose();
  }

  if (typeof document === "undefined") return null;

  const zoomPercent = Math.round(scale * 100);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="image-preview__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={label || "Image preview"}
        >
          <motion.button
            ref={closeRef}
            type="button"
            className="image-preview__close"
            onClick={onClose}
            aria-label="Close preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <X size={20} />
          </motion.button>

          <motion.div
            className="image-preview__frame"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={stageRef}
              className={`image-preview__stage${scale > 1 ? " image-preview__stage--zoomed" : ""}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {!imageLoaded && (
                <div className="image-preview__loading" aria-hidden="true">
                  <Spinner size={26} />
                </div>
              )}
              <img
                src={src}
                alt={alt}
                className="image-preview__img"
                onLoad={() => setImageLoaded(true)}
                draggable={false}
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                }}
              />
            </div>

            {label && imageLoaded && (
              <span className="image-preview__label">{label}</span>
            )}

            <div className="image-preview__toolbar" role="toolbar" aria-label="Image zoom controls">
              <button
                type="button"
                className="image-preview__tool"
                onClick={() => zoomBy(1 / 1.2)}
                disabled={scale <= MIN_SCALE}
                aria-label="Zoom out"
              >
                <Minus size={16} />
              </button>
              <span className="image-preview__zoom-readout" aria-live="polite">
                {zoomPercent}%
              </span>
              <button
                type="button"
                className="image-preview__tool"
                onClick={() => zoomBy(1.2)}
                disabled={scale >= MAX_SCALE}
                aria-label="Zoom in"
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                className="image-preview__tool"
                onClick={resetView}
                disabled={scale === 1 && pan.x === 0 && pan.y === 0}
                aria-label="Reset zoom"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
