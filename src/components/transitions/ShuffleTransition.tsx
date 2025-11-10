import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ShuffleTransition({
  onDone,
  duration = 800,
  cardCount = 6,
}: {
  onDone: () => void;
  duration?: number;
  cardCount?: number;
}) {
  const cards = React.useMemo(() => Array.from({ length: cardCount }, (_, i) => i), [cardCount]);

  React.useEffect(() => {
    const id = setTimeout(onDone, duration);
    return () => clearTimeout(id);
  }, [onDone, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-neutral-950/70 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-[380px] h-[260px]">
        <AnimatePresence>
          {cards.map((i) => (
            <motion.div
              key={i}
              className="absolute w-36 h-52 bg-white rounded-2xl shadow-2xl border border-neutral-200"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
              animate={{
                x: Math.sin((i * Math.PI) / 3) * 100,
                y: Math.cos((i * Math.PI) / 3) * 30,
                rotate: (i - 2) * 8,
                opacity: 1,
              }}
              exit={{ y: 260, opacity: 0, rotate: 16 }}
              transition={{ duration: 0.55, delay: i * 0.04, type: "spring", stiffness: 220, damping: 20 }}
            >
              <div className="w-full h-full grid place-items-center text-neutral-700 text-lg font-semibold">
                #{i + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
