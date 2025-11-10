// src/components/panels/AboutPanel.tsx
import { motion } from "framer-motion";
import { asset } from "../../lib/asset";
import {
  ABOUT_SKILLS,
  ABOUT_TOOLS,
  HIGHLIGHTS,
  safeArray,
} from "../../config/data";
import { useMemo } from "react";

type Props = {
  picked?: string | null;
};

const LOGO_MAP: Record<string, string> = {
  "c#": asset("tech/CS.png"),
  ".net": asset("tech/.NET.png"),
  cpp: asset("tech/CPP.png"),
  "c++": asset("tech/CPP.png"),
  react: asset("tech/React.png"),
  typescript: asset("tech/TypeScript.png"),
  tailwind: asset("tech/Tailwind.png"),
  django: asset("tech/Django.png"),
  python: asset("tech/Python.png"),
  docker: asset("tech/Docker.png"),
  postgres: asset("tech/PostgreSQL.png"),
  postgresql: asset("tech/PostgreSQL.png"),
  sqlite: asset("tech/SQLite.png"),
  aws: asset("tech/AWS.png"),
  unity: asset("tech/Unity.png"),
  godot: asset("tech/Godot.png"),
  git: asset("tech/Git.png"),
  "vs code": asset("tech/VS Code.png"),
  "visual studio code": asset("tech/VS Code.png"),
};

function normalizeLabel(s: string) {
  return s.toLowerCase().trim();
}
function getLogoSrc(label: string): string | null {
  const key = normalizeLabel(label);
  if (LOGO_MAP[key]) return LOGO_MAP[key];
  for (const k of Object.keys(LOGO_MAP)) {
    if (key.includes(k)) return LOGO_MAP[k];
  }
  return null;
}

function LogoGrid({ items }: { items: string[] }) {
  const list = safeArray(items)
    .map((label) => ({ label, src: getLogoSrc(label) }))
    .filter((x) => x.src);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {list.map(({ label, src }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border p-3 bg-white/60 dark:bg-white/5 hover:shadow-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src={src ?? ""}
              alt={label}
              title={label}
              loading="lazy"
              className="h-10 w-10 object-contain"
            />
            <div className="text-xs text-center leading-tight">{label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Certificates */
const CERTS = [
  {
    title: "C# Programming for Unity",
    file: asset("certificates/C Sharp Programming for Unity.pdf"),
    img: asset("media/cu_logo.png"),
  },
  {
    title: "Complete C# Unity Game Developer 2D",
    file: asset("certificates/Complete C Sharp Unity Game Developer 2D.pdf"),
    img: asset("media/GameDevLogo.png"),
  },
  {
    title: "Google IT",
    file: asset("certificates/Google IT.pdf"),
    img: asset("media/GoogleLogo.jpg"),
  },
  {
    title: "Intro to Godot Course",
    file: asset("certificates/Intro to Godot Course.pdf"),
    img: asset("media/zenvalogo.png"),
  },
  {
    title: "Unity 2.5D Turn-Based RPG",
    file: asset("certificates/Unity 2.5D Turn-Based RPG.pdf"),
    img: asset("media/GameDevLogo.png"),
  },
];

/** Inline PDF icon fallback */
function PdfIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <rect x="7.75" y="12.25" width="8.5" height="6.5" rx="0.75" />
      <path d="M9.25 15.25h1.25a1 1 0 0 1 0 2H9.25v-2zM12 17.25v-2h1M12 16.25h1M14.5 15.25h1.25v2" />
    </svg>
  );
}

function CertCard({
  title,
  file, // already a full, correct URL from asset(...)
  img,
}: {
  title: string;
  file: string;
  img?: string;
}) {
  const href = file; // ✅ use as-is

  return (
    <div className="text-left rounded-2xl border p-4 bg-white hover:shadow-md transition">
      {/* Thumbnail area */}
      <div className="aspect-[4/3] w-full rounded-xl border flex items-center justify-center bg-white overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={`${title} logo`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        ) : (
          <PdfIcon className="w-10 h-10 text-gray-500" />
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-[var(--fg)]">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-100 transition"
          >
            View
          </a>
          <a
            href={href}
            download
            className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-100 transition"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}


export default function AboutPanel({ picked }: Props) {
  const which = (picked ?? "What I Use").toLowerCase();
  const MOVE_TOOLS = ["aws", "unity", "godot", "docker"];

  const skillsFiltered = useMemo(
    () =>
      safeArray(ABOUT_SKILLS).filter(
        (item) => !MOVE_TOOLS.includes(normalizeLabel(item))
      ),
    []
  );

  const toolsMerged = useMemo(
    () => [
      ...safeArray(ABOUT_TOOLS),
      ...safeArray(ABOUT_SKILLS).filter((item) =>
        MOVE_TOOLS.includes(normalizeLabel(item))
      ),
    ],
    []
  );

  // ---------------------
  // WHAT I USE
  // ---------------------
  if (which === "what i use" || which === "me") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <section className="rounded-3xl border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4 text-[var(--fg)]">Tech Stack</h2>
          <LogoGrid items={skillsFiltered} />
        </section>

        <section className="rounded-3xl border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4 text-[var(--fg)]">Tools I Use</h2>
          <LogoGrid items={toolsMerged} />
        </section>
      </motion.div>
    );
  }

  // ---------------------
  // CERTIFICATES
  // ---------------------
  if (which === "certificates") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <section className="rounded-3xl border p-6 bg-white">
          <h2 className="text-xl font-semibold mb-2 text-[var(--fg)]">Certificates</h2>
          <p className="text-sm text-gray-600 mb-6">
            Click <em>View</em> to open in a new tab, or <em>Download</em> to save the PDF.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERTS.map((c) => (
              <CertCard key={c.file} title={c.title} file={c.file} img={c.img} />
            ))}
          </div>
        </section>
      </motion.div>
    );
  }

  // ---------------------
  // CV (default)
  // ---------------------
  const cvHref = asset("certificates/CV v0.2.pdf");

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <section className="rounded-3xl border bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-xl font-semibold text-[var(--fg)]">My CV</h2>
          <div className="flex gap-2">
            <a
              href={cvHref}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-100 transition"
            >
              View in new tab
            </a>
            <a
              href={cvHref}
              download
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-100 transition"
            >
              Download
            </a>
          </div>
        </div>

        <div className="px-6 pb-6">
          <iframe
            src={cvHref}
            className="w-full h-[min(85vh,1000px)] rounded-2xl bg-white"
          />
        </div>
      </section>

      {Array.isArray(HIGHLIGHTS) && HIGHLIGHTS.length > 0 && (
        <section className="rounded-3xl border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-3 text-[var(--fg)]">About Me</h2>
          <ul className="list-disc pl-5 space-y-1 text-[var(--fg)]">
            {HIGHLIGHTS.map((h: string, i: number) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
}
