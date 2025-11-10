import { useEffect, useRef } from "react";

type StarfieldProps = {
  /** Overall opacity for the star layer (0–1) */
  opacity?: number;
  /** Approx. stars per 10,000 screen px */
  density?: number;
  /** Max gentle drift speed in px/sec */
  driftMax?: number;
  /** Subtle twinkle animation */
  twinkle?: boolean;
  /** Slight parallax response to pointer */
  parallax?: boolean;
  /** "glow" (soft) or "sharp" (crisp pixel dots) */
  look?: "glow" | "sharp";
  /** z-index utility class (e.g., "z-0") */
  className?: string;
};

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  driftX: number;
  driftY: number;
};

export default function Starfield({
  opacity = 0.45,
  density = 0.9,
  driftMax = 8,
  twinkle = true,
  parallax = true,
  look = "glow",
  className = "z-0",
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const dprRef = useRef<number>(1);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const init = () => {
    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    dprRef.current = dpr;

    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = w * h;
    const count = Math.max(80, Math.floor((area / 10000) * density));
    const stars: Star[] = new Array(count).fill(0).map(() => {
      // Slightly smaller for sharp mode for crispness
      const r = look === "sharp" ? rand(0.35, 1.0) : rand(0.4, 1.25);
      const baseAlpha = rand(0.25, 0.8);
      const phase = rand(0, Math.PI * 2);
      const driftX = reduceMotion ? 0 : rand(-driftMax, driftMax);
      const driftY = reduceMotion ? 0 : rand(-driftMax, driftMax);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        baseAlpha,
        phase,
        driftX,
        driftY,
      };
    });
    starsRef.current = stars;
  };

  const draw = (t: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    const dt = lastTimeRef.current ? (t - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = t;

    ctx.clearRect(0, 0, w, h);

    const mx = parallax ? (mouseRef.current.x - 0.5) * 10 : 0;
    const my = parallax ? (mouseRef.current.y - 0.5) * 10 : 0;

    for (const s of starsRef.current) {
      // drift
      s.x += s.driftX * dt * 0.05;
      s.y += s.driftY * dt * 0.05;

      // wrap
      if (s.x < -5) s.x = w + 5;
      if (s.x > w + 5) s.x = -5;
      if (s.y < -5) s.y = h + 5;
      if (s.y > h + 5) s.y = -5;

      // twinkle
      if (twinkle && !reduceMotion) s.phase += dt * rand(0.8, 1.4);
      const alpha = clamp(
        s.baseAlpha * (twinkle ? 0.75 + 0.25 * Math.sin(s.phase) : 1),
        0.05,
        1
      );

      // parallax offset
      const px = s.x + mx * (0.3 + s.r * 0.2);
      const py = s.y + my * (0.3 + s.r * 0.2);

      if (look === "sharp") {
        // SHARP: pixel-snapped 1–2 px dots, no glow
        const dpr = dprRef.current;
        const sx = snapToPixel(px, dpr);
        const sy = snapToPixel(py, dpr);
        const size = s.r < 0.7 ? 1 : 2;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(sx, sy, size, size);
      } else {
        // GLOW: soft halo + core
        const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 6);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    init();
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => init();

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!parallax) return;
      let clientX: number, clientY: number;
      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        clientX = t.clientX;
        clientY = t.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (clientX - rect.left) / rect.width;
      mouseRef.current.y = (clientY - rect.top) / rect.height;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("touchmove", onMove as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, driftMax, twinkle, parallax, look]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      {/* Depth gradient under stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090c16] via-[#0d1120] to-[#11172a]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
      />
      {/* vignette for focus */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_65%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
function snapToPixel(x: number, dpr: number) {
  return Math.round(x * dpr) / dpr;
}
