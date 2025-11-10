import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AboutStarfallProps = {
  show: boolean;
  onComplete?: () => void;
  durationMs?: number;     // total duration (default 1600)
  accent?: string;         // accent color for trails/constellation
  name?: string;           // used to derive initials (fallback: "MS")
  initials?: string;       // optional hard override, e.g. "MSU"
};

// Derive up to 3 initials from name (first letter of each word, max 3).
function initialsFrom3(name?: string) {
  if (!name) return "MS";
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");
  const out = letters.slice(0, 3);
  return out || "MS";
}

/**
 * AboutStarfallTransition — a wishing-on-a-star transition
 * - Twinkling night sky
 * - Shooting stars with soft trails
 * - Constellation animates into your initials, then fades
 */
export default function AboutStarfallTransition({
  show,
  onComplete,
  durationMs = 1600,
  accent = "#8ab6ff",
  name,
  initials: initialsOverride,
}: AboutStarfallProps) {
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<HTMLCanvasElement | null>(null);
  const rafBg = useRef<number | null>(null);
  const rafFx = useRef<number | null>(null);

  // Use explicit initials override if provided; otherwise derive up to 3 chars from name
  const initials = useMemo(
    () => (initialsOverride?.toUpperCase() || initialsFrom3(name)),
    [initialsOverride, name]
  );

  // --- Background twinkle layer (cheap) ---
  useEffect(() => {
    if (!show) return;
    const c = bgRef.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);

    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      seed();
    };
    window.addEventListener("resize", resize);

    type Star = { x: number; y: number; r: number; a: number; v: number };
    let stars: Star[] = [];

    const seed = () => {
      const count = Math.min(220, Math.floor((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * Math.PI * 2,
        v: 0.006 + Math.random() * 0.01,
      }));
    };
    seed();

    const step = () => {
      // Night gradient
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(6,10,22,1)");
      g.addColorStop(1, "rgba(12,16,30,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Twinkles
      for (const s of stars) {
        s.a += s.v;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.a));
        ctx.globalAlpha = tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafBg.current = requestAnimationFrame(step);
    };
    rafBg.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafBg.current) cancelAnimationFrame(rafBg.current);
    };
  }, [show]);

  // --- Foreground FX: shooting stars + initials constellation ---
  useEffect(() => {
    if (!show) return;
    const c = fxRef.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);

    const resize = () => {
      w = (c.width = window.innerWidth);
      h = (c.height = window.innerHeight);
      buildConstellation();
    };
    window.addEventListener("resize", resize);

    type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    let meteors: Meteor[] = [];

    const spawnMeteor = () => {
      const startX = -50 + Math.random() * 200;
      const startY = Math.random() * (h * 0.4);
      const speed = 8 + Math.random() * 5;
      const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 50 + Math.random() * 20,
      });
    };

    // Seed a few meteors at start
    spawnMeteor();
    setTimeout(spawnMeteor, 150);
    setTimeout(spawnMeteor, 300);

    // Constellation as STROKES (no cross-letter connections)
    type Pt = { x: number; y: number };
    let strokes: Pt[][] = []; // array of polylines
    const buildConstellation = () => {
      const size = Math.min(280, Math.floor(Math.min(w, h) * 0.28));
      const cx = w / 2;
      const cy = h / 2;
      strokes = makeInitialsStrokes(initials, cx, cy, size);
    };
    buildConstellation();

    // ---- Letter builders: return one or more polylines (strokes) ----
    function makeInitialsStrokes(chars: string, cx: number, cy: number, size: number): Pt[][] {
      const gap = size * 0.14;
      const letterW = size * 0.38;
      const letterH = size * 0.7;
      const out: Pt[][] = [];

      const sampleLine = (a: Pt, b: Pt, steps: number) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
        }
        return pts;
      };
      const samplePolyline = (poly: Pt[], samples: number) => {
        const pts: Pt[] = [];
        for (let i = 0; i < poly.length - 1; i++) {
          const seg = sampleLine(poly[i], poly[i + 1], Math.max(2, Math.floor(samples / (poly.length - 1))));
          if (i > 0) seg.shift(); // avoid duplicates at joints
          pts.push(...seg);
        }
        return pts;
      };

      const drawM = (ox: number, oy: number) => {
        const topL = { x: ox, y: oy - letterH / 2 };
        const botL = { x: ox, y: oy + letterH / 2 };
        const topR = { x: ox + letterW, y: oy - letterH / 2 };
        const botR = { x: ox + letterW, y: oy + letterH / 2 };
        const mid = { x: ox + letterW / 2, y: oy - letterH * 0.1 };
        out.push(sampleLine(topL, botL, 10));
        out.push(sampleLine(topR, botR, 10));
        out.push(sampleLine(topL, mid, 9));
        out.push(sampleLine(mid, topR, 9));
      };

      const drawS = (ox: number, oy: number) => {
        const t = letterH / 2;
        const left = ox;
        const right = ox + letterW;
        const poly: Pt[] = [
          { x: right, y: oy - t }, { x: ox + letterW * 0.6, y: oy - t }, { x: left, y: oy - t * 0.35 },
          { x: ox + letterW * 0.1, y: oy }, { x: ox + letterW * 0.7, y: oy + t * 0.2 },
          { x: right, y: oy + t * 0.15 }, { x: ox + letterW * 0.55, y: oy + t }, { x: left, y: oy + t },
        ];
        out.push(samplePolyline(poly, 48)); // single stroke = no cross-letter lines
      };

      const drawU = (ox: number, oy: number) => {
        // Left vertical
        out.push(sampleLine({ x: ox, y: oy - letterH / 2 }, { x: ox, y: oy + letterH / 2 }, 10));
        // Bottom bowl (arc) for nicer U
        const r = letterW / 2;
        const cx2 = ox + r;
        const cy2 = oy + letterH / 2;
        const arcPts: Pt[] = [];
        const steps = 22;
        for (let i = 0; i <= steps; i++) {
          const a = Math.PI; // 180°
          const b = 0;       // 0°
          const t = i / steps;
          const th = a + (b - a) * t; // sweep from left to right
          arcPts.push({ x: cx2 + r * Math.cos(th), y: cy2 + r * Math.sin(th) });
        }
        out.push(arcPts);
        // Right vertical
        out.push(sampleLine({ x: ox + letterW, y: oy + letterH / 2 }, { x: ox + letterW, y: oy - letterH / 2 }, 10));
      };

      const letters = chars.slice(0, 3).split("");
      const totalW = letters.length * letterW + (letters.length - 1) * gap;
      const startX = cx - totalW / 2;
      const oy = cy + letterH * 0.02;

      letters.forEach((c, i) => {
        const ox = startX + i * (letterW + gap);
        if (c === "M") drawM(ox, oy);
        else if (c === "S") drawS(ox, oy);
        else if (c === "U") drawU(ox, oy);
      });

      return out;
    }

    let t0 = performance.now();
    const step = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        const trailLen = 10;
        for (let j = 0; j < trailLen; j++) {
          const a = 1 - j / trailLen;
          ctx.globalAlpha = 0.08 * a;
          ctx.fillStyle = accent;
          ctx.fillRect(m.x - m.vx * j * 0.7, m.y - m.vy * j * 0.7, 3, 2);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        m.x += m.vx; m.y += m.vy;
        if (m.life % 8 === 0 && meteors.length < 6) spawnMeteor();
        if (m.x > w + 80 || m.y > h + 80 || m.life > m.max) meteors.splice(i, 1);
      }

      // Reveal fraction
      const revealMs = durationMs * 0.6;
      const f = Math.min(1, (t - t0) / revealMs);

      // Draw each stroke independently (no cross connections)
      ctx.lineWidth = 1.2;
      strokes.forEach((stroke) => {
        const n = Math.max(0, Math.floor(stroke.length * f));
        for (let i = 0; i < n; i++) {
          const p = stroke[i];
          // star point
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
          // glow
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          // connect ONLY to previous point within this stroke
          if (i > 0) {
            const a = stroke[i - 1], b = p;
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = accent;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      rafFx.current = requestAnimationFrame(step);
    };
    rafFx.current = requestAnimationFrame(step);

    const timer = setTimeout(() => onComplete?.(), durationMs);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafFx.current) cancelAnimationFrame(rafFx.current);
      clearTimeout(timer);
    };
  }, [show, durationMs, accent, initials, onComplete]);


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[230] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* BG twinkle */}
          <canvas ref={bgRef} className="absolute inset-0 w-full h-full" />
          {/* FX: meteors + constellation */}
          <canvas ref={fxRef} className="absolute inset-0 w-full h-full" />

          {/* Make-a-wish micro-copy */}
          <motion.div
            className="absolute inset-x-0 bottom-[18%] text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span
              className="select-none"
              style={{
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                fontSize: "clamp(14px, 2vw, 18px)",
              }}
            >
              make a wish ✨
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
