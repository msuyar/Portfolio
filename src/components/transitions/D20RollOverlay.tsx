import * as React from "react";
import { motion } from "framer-motion";

type D20RollOverlayProps = {
  /** Called AFTER the animation + 5s message delay. */
  onDone: (result: { roll: number; success: boolean }) => void;
  /** Total animation duration in ms (spin + settle). */
  duration?: number;
  color?: string;
  stroke?: string;
  /** If provided, clamps this to [1, 20] and uses it instead of random. */
  forcedResult?: number;
  /** Difficulty Class – roll >= dc is success. Defaults to 7. */
  dc?: number;
  /** Optional label used in text, e.g. "D&D section". */
  label?: string;
};

export function D20RollOverlay({
  onDone,
  duration = 1000,
  color = "#ef4444",
  stroke = "#991b1b",
  forcedResult,
  dc = 10,
  label = "section",
}: D20RollOverlayProps) {
  const [hasRolled, setHasRolled] = React.useState(false);
  const [result, setResult] = React.useState<number | null>(null);
  const [showOutcome, setShowOutcome] = React.useState(false);

  const success = result !== null ? result >= dc : false;
  const isCrit = result === 20;
  const isFail = result === 1;

  // viewport sizing
  const { w, h, cx, cy } = React.useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return { w: vw, h: vh, cx: vw / 2, cy: vh / 2 };
  }, []);

  const diceCy = cy * 0.55;

  const poly = (n: number, r: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(" ");

  const rOuter = 58;
  const rInner = 28;

  const spinSec = Math.min(0.75, (duration / 1000) * 0.75);
  const settleSec = Math.max(0.15, duration / 1000 - spinSec);
  const totalAnimMs = duration + 500; // same as your old overlay

  // Handle roll click
  function handleRoll() {
    if (hasRolled) return; // prevent spamming

    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const final = Math.max(1, Math.min(20, forcedResult ?? randomRoll));
    setResult(final);
    setHasRolled(true);
  }

  // After we have a result -> show outcome, then call onDone after 5s
  React.useEffect(() => {
    if (!hasRolled || result == null) return;

    const showOutcomeId = window.setTimeout(() => {
      setShowOutcome(true);
    }, totalAnimMs);

    const doneId = window.setTimeout(() => {
      onDone({ roll: result, success });
    }, totalAnimMs + 1500); // 1.5s after outcome is revealed

    return () => {
      window.clearTimeout(showOutcomeId);
      window.clearTimeout(doneId);
    };
  }, [hasRolled, result, success, totalAnimMs, onDone]);

  // Text logic
  let mainLine: string;
  let subLine: string;

  if (!hasRolled) {
    mainLine = "Roll to see if you can enter!";
    subLine = `Click the button below to roll a d20. You need DC ${dc} to view the ${label}.`;
  } else if (!showOutcome) {
    mainLine = "Rolling…";
    subLine = "The die is in the air...";
  } else if (isFail) {
    mainLine = "You rolled a Natural 1!";
    subLine = `Automatic failure. DC ${dc} was required. Redirecting…`;
  } else if (isCrit) {
    mainLine = "You rolled a Natural 20!";
    subLine = `Critical success! You easily beat DC ${dc}. Redirecting…`;
  } else {
    mainLine = `You rolled a ${result}`;
    subLine = success
      ? `Success! DC ${dc} met. Redirecting to the ${label}`
      : `Failed the check (DC ${dc}).`;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,15,15,0.75)] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* SVG dice background (visual only) */}
      <svg
        width={w}
        height={h}
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <filter id="d20glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* subtle vignette */}
        <rect x="0" y="0" width={w} height={h} fill="rgba(15,15,15,0.55)" />

        {/* shadow under the die */}
        <motion.ellipse
          cx={cx}
          cy={diceCy + 90}
          rx="68"
          ry="14"
          fill="rgba(0,0,0,0.28)"
          initial={{ opacity: 0, scaleX: 0.85 }}
          animate={{
            opacity: hasRolled ? [0, 1, 0.9] : 0.9,
            scaleX: hasRolled ? [0.85, 1, 0.95] : 1,
          }}
          transition={{ duration: spinSec + settleSec, ease: "easeOut" }}
        />

        <g transform={`translate(${cx} ${diceCy})`}>
          <motion.g
            initial={{ rotate: 0, scale: 0.94, y: 0 }}
            animate={
              hasRolled
                ? {
                    rotate: 720,
                    scale: [0.94, 1.05, 0.98, 1],
                    y: [0, -8, 0],
                  }
                : { rotate: 0, scale: 1, y: 0 }
            }
            transition={
              hasRolled
                ? {
                    rotate: { duration: spinSec, ease: [0.2, 0.8, 0.0, 1] },
                    scale: { duration: spinSec, ease: "easeOut" },
                    y: { duration: spinSec * 0.6, ease: "easeOut" },
                  }
                : { duration: 0.001 }
            }
            filter="url(#d20glow)"
          >
            {/* Outer poly */}
            <polygon
              points={poly(20, rOuter)}
              fill={color}
              stroke={stroke}
              strokeWidth="3"
            />
            {/* Inner poly */}
            <polygon
              points={poly(10, rInner)}
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              opacity="0.95"
            />
            {/* Spokes */}
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 10 - Math.PI / 2;
              const x = Math.cos(a) * rInner;
              const y = Math.sin(a) * rInner;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={stroke}
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Number: show "?" before roll, actual result after animation starts */}
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
              transition={{
                delay: hasRolled ? spinSec - 0.05 : 0.1,
                duration: Math.max(0.1, settleSec * 0.6),
                ease: "easeOut",
              }}
            >
              {hasRolled && result != null ? result : "?"}
            </motion.text>
          </motion.g>
        </g>

        {/* Success/fail ring after outcome is shown */}
        {showOutcome && hasRolled && result !== null && (
          <motion.circle
            cx={cx}
            cy={diceCy}
            r={rOuter + 16}
            fill="none"
            stroke={success ? "#22c55e" : "#ef4444"} // green = success, red = fail
            strokeWidth="6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0.5], scale: [0.8, 1, 1.02] }}
            transition={{
              duration: settleSec,
              ease: "easeOut",
            }}
            filter="url(#d20glow)"
          />
        )}
      </svg>

      {/* TEXT + BUTTON BELOW THE D20 */}
      <div className="relative z-10 max-w-xl w-full mt-[40vh] px-6 pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-5 text-center space-y-3 shadow-lg border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            {label === "D&D section"
              ? "The gate to the D&D section..."
              : "The gate stands before you..."}
          </h2>

          <p className="text-sm sm:text-base text-gray-200">{mainLine}</p>
          <p className="text-xs sm:text-sm text-gray-300">{subLine}</p>

          {!hasRolled && (
            <button
              type="button"
              onClick={handleRoll}
              className="mt-2 inline-flex items-center justify-center rounded-full border border-gray-100/40 bg-black/40 px-5 py-2 text-sm font-semibold text-gray-100 hover:bg-black/70 transition"
            >
              🎲 Roll d20
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
