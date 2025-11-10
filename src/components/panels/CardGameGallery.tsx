import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title?: string;
  images: { src: string; alt?: string; caption?: string }[];
};

export default function CardGameGallery({ title, images }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback((i: number) => {
    setOpenIdx(i);
    setPageSize(false);
  }, []);

  const close = useCallback(() => {
    setOpenIdx(null);
    setPageSize(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + images.length - 1) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  const togglePageSize = useCallback(async () => {
    setPageSize((p) => !p);
    try {
      if (!document.fullscreenElement && frameRef.current) {
        await frameRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  // keyboard nav when modal is open
  useMemo(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key.toLowerCase() === "f") togglePageSize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, close, prev, next, togglePageSize]);

  // sync when user exits fullscreen via browser UI
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setPageSize(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div
      className="space-y-3"
      // If this gallery is inside a <Link> or clickable parent, keep clicks local:
      onClickCapture={(e) => e.stopPropagation()}
    >
      {title && <div className="text-sm text-[var(--muted)]">{title}</div>}

      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            type="button" // ✅ prevent submit
            key={img.src + i}
            onClick={() => open(i)}
            className="group rounded-2xl overflow-hidden border"
            style={{ borderColor: "var(--border)" }}
            aria-label={`Open ${img.alt ?? "image"}`}
          >
            <img
              src={img.src}
              alt={img.alt ?? ""}
              loading="lazy"
              className="aspect-square object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              ref={frameRef}
              className={
                "relative overflow-hidden bg-[var(--card)] " +
                (pageSize
                  ? "w-screen h-screen rounded-none" // page-size (edge-to-edge)
                  : "max-w-5xl w-[92vw] max-h-[86vh] rounded-2xl") // default
              }
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[openIdx].src}
                alt={images[openIdx].alt ?? ""}
                className={
                  "w-full bg-black " +
                  (pageSize ? "h-[100vh] object-contain" : "h-full object-contain")
                }
                style={pageSize ? undefined : { maxHeight: "75vh" }}
                onClick={togglePageSize} // click to toggle page-size
              />

              {/* caption + controls */}
              <div
                className={
                  "flex items-center justify-between gap-2 p-3 text-sm " +
                  (pageSize ? "absolute bottom-0 left-0 right-0 bg-black/40 text-white" : "")
                }
              >
                <span className="truncate text-[var(--muted)]">
                  {images[openIdx].caption ?? images[openIdx].alt ?? ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="rounded-xl border px-3 py-1"
                    style={{ borderColor: "var(--border)" }}
                    aria-label="Previous image"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-xl border px-3 py-1"
                    style={{ borderColor: "var(--border)" }}
                    aria-label="Next image"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    onClick={togglePageSize}
                    className="rounded-xl border px-3 py-1"
                    style={{ borderColor: "var(--border)" }}
                    aria-label="Toggle page-size"
                    title="Toggle page-size (F)"
                  >
                    ⤢
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl border px-3 py-1"
                    style={{ borderColor: "var(--border)" }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
