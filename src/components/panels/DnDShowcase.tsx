import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { id: string; title: string; caption: string; src: string };

export function DndShowcase({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i! - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i! + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, prev, next]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">The World (Homebrew Setting Overview)</h2>
        <p className="text-sm text-gray-600">
          A custom world torn between six empires and divine conflict. These slides outline the nations,
          gods, and holy orders shaping the realm.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <motion.button
            key={it.id}
            onClick={() => setOpenIndex(idx)}
            className="group relative overflow-hidden rounded-2xl shadow hover:shadow-lg focus:outline-none"
            whileHover={{ scale: 1.01 }}
          >
            <img src={it.src} alt={it.title} className="w-full h-56 object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-black/55 text-white px-3 py-2">
              <div className="text-sm font-medium">{it.title}</div>
              <div className="text-xs opacity-90">{it.caption}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative max-w-6xl w-full"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[openIndex].src}
                alt={items[openIndex].title}
                className="w-full max-h-[80vh] object-contain rounded-2xl shadow-lg"
              />
              <div className="mt-3 text-center text-white">
                <div className="text-lg font-semibold">{items[openIndex].title}</div>
                <div className="text-sm opacity-90">{items[openIndex].caption}</div>
              </div>

              <button
                onClick={close}
                className="absolute -top-3 -right-3 rounded-full bg-white/90 hover:bg-white px-3 py-1 text-gray-900 text-sm shadow"
              >
                ✕
              </button>
              <button
                onClick={prev}
                className="absolute inset-y-0 left-0 m-2 rounded-full bg-white/80 hover:bg-white px-3 py-2 text-gray-800 text-sm shadow"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute inset-y-0 right-0 m-2 rounded-full bg-white/80 hover:bg-white px-3 py-2 text-gray-800 text-sm shadow"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
