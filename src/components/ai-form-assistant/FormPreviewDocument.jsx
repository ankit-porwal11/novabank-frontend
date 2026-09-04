import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Renders backend previewHtml in an isolated light-scheme document.
 *
 * previewHtml is a print/PDF template (typically `.page { width: 1100px }`).
 * Injecting it with dangerouslySetInnerHTML puts that markup in the same
 * document as theme.css, so:
 *   - body { color: var(--color-text) } (#f8fafc) inherits into the form
 *   - html { color-scheme: dark } inherits as an inherited property
 *   - the universal reset (*, *::before, *::after { margin:0; padding:0 })
 *     matches every table cell in the form
 *   - any <style> inside previewHtml (e.g. `.page { width: 1100px }`) is
 *     applied as a global document stylesheet and can leak into the
 *     DashboardLayout chrome while this page is mounted
 *
 * An iframe srcDoc is a separate document, so none of those apply. Scaling
 * is a uniform transform (not a width reflow), so the 1100px page layout
 * is preserved while fitting the dashboard content column.
 */

const LIGHT_CANVAS_CSS = `
html { color-scheme: light; background: #ffffff; }
body { margin: 0; background: #ffffff; color: #111827; }
`;

function buildSrcDoc(previewHtml) {
  const html = String(previewHtml ?? "").trim();
  if (!html) return "";

  const canvasTag = `<style data-form-preview-canvas="true">${LIGHT_CANVAS_CSS}</style>`;
  const looksFullDocument = /<html[\s>]/i.test(html) || /^<!DOCTYPE/i.test(html);

  if (looksFullDocument) {
    if (/<head[\s>]/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, `<head$1>${canvasTag}`);
    }
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${canvasTag}</head>`);
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${canvasTag}</head><body>${html}</body></html>`;
}

// The preview must never shrink past this scale — below it the form
// becomes unreadable on narrow/mobile viewports. When the host is too
// narrow to fit the full-size page at this scale, the frame-host (not
// the page) takes over horizontal scrolling instead of shrinking further.
const MIN_READABLE_SCALE = 0.55;

function measureDocument(doc) {
  const page = doc.querySelector(".page");
  const width = Math.max(
    page?.getBoundingClientRect().width ?? 0,
    page?.scrollWidth ?? 0,
    doc.documentElement?.scrollWidth ?? 0,
    doc.body?.scrollWidth ?? 0,
    1100
  );
  const height = Math.max(
    page?.getBoundingClientRect().height ?? 0,
    page?.scrollHeight ?? 0,
    doc.documentElement?.scrollHeight ?? 0,
    doc.body?.scrollHeight ?? 0,
    1
  );
  return { width, height };
}

export default function FormPreviewDocument({ html }) {
  const hostRef = useRef(null);
  const iframeRef = useRef(null);
  const contentObserverRef = useRef(null);
  const srcDoc = useMemo(() => buildSrcDoc(html), [html]);
  const [metrics, setMetrics] = useState({
    scale: 1,
    width: 1100,
    height: 0,
    ready: false,
  });

  const disconnectContentObserver = useCallback(() => {
    contentObserverRef.current?.disconnect();
    contentObserverRef.current = null;
  }, []);

  const syncMetrics = useCallback(() => {
    const host = hostRef.current;
    const doc = iframeRef.current?.contentDocument;
    if (!host || !doc?.body) return;

    const { width, height } = measureDocument(doc);
    const hostWidth = host.clientWidth;
    const fitScale = width > 0 ? hostWidth / width : 1;
    // Never scale below the readable floor. On desktop this clamp never
    // engages (fitScale is comfortably above it), so desktop sizing is
    // unchanged. On narrow/mobile hosts, holding the floor keeps the form
    // legible and lets the frame-host scroll horizontally instead.
    const scale = Math.min(1, Math.max(fitScale, MIN_READABLE_SCALE));

    setMetrics({
      scale,
      width,
      height,
      ready: true,
    });
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => {
      syncMetrics();
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [syncMetrics]);

  useEffect(() => {
    setMetrics((current) => ({ ...current, ready: false }));
    return () => disconnectContentObserver();
  }, [srcDoc, disconnectContentObserver]);

  const handleLoad = useCallback(() => {
    disconnectContentObserver();
    syncMetrics();

    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      syncMetrics();
    });
    observer.observe(doc.body);
    const page = doc.querySelector(".page");
    if (page) observer.observe(page);
    contentObserverRef.current = observer;

    doc.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", syncMetrics);
        img.addEventListener("error", syncMetrics);
      }
    });
  }, [disconnectContentObserver, syncMetrics]);

  if (!srcDoc) return null;

  return (
    <div
      ref={hostRef}
      className="form-preview-page__frame-host"
      style={{
        height: metrics.ready ? metrics.height * metrics.scale : undefined,
      }}
    >
      <iframe
        ref={iframeRef}
        className="form-preview-page__frame"
        title="Form preview"
        sandbox="allow-same-origin"
        srcDoc={srcDoc}
        onLoad={handleLoad}
        style={{
          width: metrics.width,
          height: metrics.height || undefined,
          transform: `scale(${metrics.scale})`,
          opacity: metrics.ready ? 1 : 0,
        }}
      />
    </div>
  );
}