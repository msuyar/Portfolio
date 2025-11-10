import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gameDevSnippets } from "../../content/gameDevSnippets";

export const CourseSubsections = {
  UNITY_2D: "Complete C# Unity Game Developer 2D",
  UNITY_25D_RPG: "Unity 2.5D Turn-Based RPG",
} as const;

type Snippet = {
  id: number;
  title: string;
  desc: string;
  video: string;
  thumb: string;
  subsection?: string;
};

export default function GameDevSnippets({ subsection }: { subsection: string }) {
  const available = useMemo(() => {
    const set = new Set<string>();
    for (const s of gameDevSnippets) if (s.subsection) set.add(s.subsection.trim());
    return Array.from(set).sort();
  }, []);

  const items = useMemo(() => {
    const want = subsection.toLowerCase().trim();
    return gameDevSnippets.filter((s: Snippet) => {
      if (!s.subsection) return false;
      return s.subsection.toLowerCase().trim() === want;
    });
  }, [subsection]);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">{subsection}</h2>
      {items.length === 0 ? (
        <div className="text-sm text-neutral-300">No snippets yet for this course.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((s) => (
            <SnippetCard key={s.id} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}

type SnippetProps = {
  title: string;
  desc: string;
  video: string;
  thumb: string;
};

function SnippetCard({ title, desc, video, thumb }: SnippetProps) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [vidError, setVidError] = useState(false);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  // ✅ simple resolver — your files are in /public/media
  const resolvePublic = (p: string) => (p.startsWith("/") ? p : `/${p}`);

  const thumbSrc = useMemo(() => resolvePublic(thumb), [thumb]);
  const videoSrc = useMemo(() => resolvePublic(video), [video]);

  // Try to play when hovered
  useEffect(() => {
    if (hover && vidRef.current) {
      vidRef.current.play().catch(() => {});
    }
  }, [hover]);

  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-neutral-900/80 text-white p-4 shadow-md"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => {
        setHover(false);
        if (vidRef.current) {
          vidRef.current.pause();
          vidRef.current.currentTime = 0;
        }
      }}
    >
      {/* Aspect-ratio wrapper */}
      <div className="relative rounded-xl overflow-hidden aspect-video">
        {/* ✅ Show thumbnail image by default */}
        {!imgError ? (
          <motion.img
            src={thumbSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: hover ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            onError={() => {
              console.error("[Thumb error]", title, thumbSrc);
              setImgError(true);
            }}
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs bg-neutral-800">
            No thumbnail
          </div>
        )}

        {/* ✅ Video appears on hover */}
        {!vidError && (
          <motion.video
            ref={vidRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            poster={!imgError ? thumbSrc : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            onCanPlay={() => {
              if (hover && vidRef.current) vidRef.current.play().catch(() => {});
            }}
            onError={(e) => {
              const el = e.currentTarget;
              console.error("[Video error]", title, videoSrc, {
                networkState: el.networkState,
                readyState: el.readyState,
              });
              setVidError(true);
            }}
          />
        )}
      </div>

      {/* text */}
      <div className="mt-3">
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm opacity-80 leading-snug">{desc}</p>
      </div>
    </motion.div>
  );
}
