import * as React from "react";
import { motion } from "framer-motion";

export function D20RollOverlay({
  onDone,
  duration = 1000,
  color = "#ef4444",
  stroke = "#991b1b",
  forcedResult,
}: {
  onDone: () => void;
  duration?: number;
  color?: string;
  stroke?: string;
  forcedResult?: number;
}) {
  const result = React.useMemo(
    () => Math.max(1, Math.min(20, forcedResult ?? Math.floor(Math.random() * 20) + 1)),
    [forcedResult]
  );

  React.useEffect(() => {
    const id = setTimeout(onDone, duration + 500);
    return () => clearTimeout(id);
  }, [onDone, duration]);

  const { w, h, cx, cy } = React.useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return { w: vw, h: vh, cx: vw / 2, cy: vh / 2 };
  }, []);

  const poly = (n: number, r: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(" ");

  const rOuter = 58;
  const rInner = 28;
  const isCrit = result === 20;
  const isFail = result === 1;

  const spinSec = Math.min(0.75, (duration / 1000) * 0.75);
  const settleSec = Math.max(0.15, duration / 1000 - spinSec);

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden
    >
      <svg width={w} height={h} className="absolute inset-0">
        <defs>
          <filter id="d20glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={w} height={h} fill="rgba(15,15,15,0.55)" />

        <motion.ellipse
          cx={cx}
          cy={cy + 90}
          rx="68"
          ry="14"
          fill="rgba(0,0,0,0.28)"
          initial={{ opacity: 0, scaleX: 0.85 }}
          animate={{ opacity: [0, 1, 0.9], scaleX: [0.85, 1, 0.95] }}
          transition={{ duration: spinSec + settleSec, ease: "easeOut" }}
        />

        <g transform={`translate(${cx} ${cy})`}>
          <motion.g
            initial={{ rotate: 0, scale: 0.94, y: 0 }}
            animate={{ rotate: 720, scale: [0.94, 1.05, 0.98, 1], y: [0, -8, 0] }}
            transition={{
              rotate: { duration: spinSec, ease: [0.2, 0.8, 0.0, 1] },
              scale: { duration: spinSec, ease: "easeOut" },
              y: { duration: spinSec * 0.6, ease: "easeOut" },
            }}
            filter="url(#d20glow)"
          >
            <polygon points={poly(20, rOuter)} fill={color} stroke={stroke} strokeWidth="3" />
            <polygon points={poly(10, rInner)} fill="none" stroke={stroke} strokeWidth="2" opacity="0.95" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 10 - Math.PI / 2;
              const x = Math.cos(a) * rInner;
              const y = Math.sin(a) * rInner;
              return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke={stroke} strokeWidth="1.5" />;
            })}
            <motion.text
              x="0"
              y="12"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui"
              fontSize="36"
              fontWeight="800"
              fill="#ffffff"
              stroke={stroke}
              strokeWidth="0.6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: spinSec - 0.05, duration: Math.max(0.1, settleSec * 0.6), ease: "easeOut" }}
            >
              {result}
            </motion.text>
          </motion.g>
        </g>

        {(isCrit || isFail) && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={rOuter + 16}
            fill="none"
            stroke={isCrit ? "#22c55e" : "#ef4444"}
            strokeWidth="6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0.5], scale: [0.8, 1, 1.02] }}
            transition={{ delay: spinSec - 0.05, duration: settleSec, ease: "easeOut" }}
            filter="url(#d20glow)"
          />
        )}

        <motion.text
          x={cx}
          y={cy + 130}
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui"
          fontSize="18"
          fill="#e5e7eb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: spinSec - 0.05, duration: 0.2 }}
        >
          You rolled a {result}
        </motion.text>
      </svg>
    </motion.div>
  );
}
