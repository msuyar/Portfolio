import * as React from "react";
import { motion } from "framer-motion";

export function UniversalTransition({ onDone, duration = 600 }: { onDone: () => void; duration?: number }) {
  React.useEffect(() => {
    const id = setTimeout(onDone, duration);
    return () => clearTimeout(id);
  }, [onDone, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.svg
        width="140"
        height="140"
        viewBox="0 0 100 100"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}
      >
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#a3a3a3" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#g)" strokeWidth="5" />
        {[0, 45, 90].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <ellipse cx="50" cy="50" rx="32" ry="14" fill="none" stroke="#fff" opacity="0.4" strokeWidth="2" />
          </g>
        ))}
      </motion.svg>
    </motion.div>
  );
}
