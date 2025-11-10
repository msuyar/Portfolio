// src/components/panels/ContentPanel.tsx
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS, type SectionKey } from "../../config/sections";
import GameDevSnippets, { CourseSubsections } from "../panels/GameDevSnippets";
import { gameDevSnippets } from "../../content/gameDevSnippets";
import { dndShowcase } from "../../content/dndShowcase";
import { webShowcase } from "../../content/webShowcase";
import AboutPanel from "./AboutPanel";

const normalize = (s: string) => s.toLowerCase().trim();
const eq = (a: string, b: string) => normalize(a) === normalize(b);

/** Optional: per–top-level section blurbs */
const SECTION_DESCRIPTIONS: Record<string, string> = {
  [normalize("GAME")]:
    "Unity projects and prototypes—short clips with notes and links.",
  [normalize("WEB")]:
    "Selected software & web builds (Django, REST, real-time) plus AI simulations (PyBullet + GA).",
  [normalize("DND")]:
    "Homebrew campaigns, encounter design, and tooling.",
  [normalize("ABOUT")]:
    "Quick access to my CV and a curated list of certificates.",
};

/** Per-subsection blurbs (extend as you add more) */
const SUBSECTION_DESCRIPTIONS: Record<string, string> = {
  // ---- GAME ----
  [normalize("C# Programming for Unity Game Development Specialization")]:
    `A beginner-friendly 4-course specialization teaching programming in C# through Unity game development. Covers the fundamentals of both languages and engines while guiding learners to build console apps, Unity prototypes, and two complete games through hands-on projects. (Independent work by the University of Colorado; not affiliated with Unity Technologies.) <a href="https://www.coursera.org/specializations/programming-unity-game-development" target="_blank" rel="noopener noreferrer" style="color:#3b82f6; text-decoration:underline;">View on Coursera</a>`,
  [normalize("Complete C# Unity Game Developer 2D")]:
    `Projects from the Complete C# Unity Game Developer 2D course: Laser Defender, TileVania, Snowboarder, and Quiz Master. <a href="https://www.udemy.com/share/101Wjs3@_g_VvheeoRhWPmVOqKJPzB8t8XvrNfwzs6CVhoHyzYAKe9siNGIlDihHi1aOnVFEIQ==/" target="_blank" rel="noopener noreferrer" style="color:#3b82f6; text-decoration:underline;">View on Udemy</a>`,
  [normalize("Unity 2.5D Turn-Based RPG")]:
    "Showcases the 2.5D RPG prototype featuring turn-based combat, party recruitment, and animated battle sequences. (The original Unity course is no longer open for enrollment.)",
  [normalize("Satirical Parody Card Game (85 Cards, 5 Versions)")]:
    "A card game extension to a known game, fan-made DLC card game featuring humor, parody, and original art inspired by a popular Turkish television series.",
  [normalize("Genetic Algorithm Creature Simulation")]:
    "An AI coursework project where procedural creatures evolve through genetic algorithms to climb a mountain efficiently.",

  // ---- WEB ----
  [normalize("PROJECT-HR (Multi-Tenant HR Platform - .NET 9 + ABP Framework)")]:
  "ProjectHR is a multi-tenant Human Resources Management platform built with .NET 9 and the ABP Framework, centralizing user management, leave workflows, hierarchies, and performance evaluations into one cohesive, role-based system. Featuring dynamic approval chains, weighted evaluations, and calendar-integrated scheduling, it automates complex HR operations with precision while ensuring data isolation, scalability, and enterprise-grade security — a complete solution for modern organizations aiming to digitalize workforce management.",
  [normalize("PokéWeb (Django REST API)")]:
    "A clean Django REST API consuming TheMovieDB/PokéAPI-style data with structured endpoints, pagination, and typed clients for front-end use.",
  [normalize("ElearnX (Django REST + Channels + Redis)")]:
    "A MOOC platform prototype: JWT-auth endpoints, course/catalog APIs, WebSocket chat via Django Channels, and Redis-backed notifications.",
  [normalize("MovieForge (.NET Web API)")]:
    "ASP.NET Core Web API with JWT auth, watchlists, reviews, filtering, repository pattern, and EF Core (SQLite/Postgres).",

  // ---- DND ----
  [normalize("ROSEBERRY OPS: THE FEDAILERI CHRONICLES (LINEAR STORY TELLING)")]:
    "After a cataclysm destroyed the greatest of six sacred mountains — the Dragons path to heaven — reality began to fracture. Portals to other realms opened, unleashing monsters upon the world. As the chaos spreads, our party, now entangled in guild intrigues, political power plays, and a full-scale war, seeks to uncover why the rifts are increasing.",
  [normalize("RETURN-2-BLACK-CITY (MYTHOLOGICAL CAMPAIGN)")]:
    "The party awakens in chains, forced to labor in desolate farms and fend off nocturnal swarms. Stripped of divine guidance, they discover they've been abducted into another realm — a land ruled by the Greek pantheon, where their Egyptian gods hold no sway. After escaping, they seek a way home to the Black Citadel while waging war against the deities and zealots who enslaved them.",
  [normalize("YOUNG-VILLAGERS SAGA (LEVEL 3-8 ARC)")]:
    "A band of young villagers sets out to make a name for themselves as adventurers. Their first act of compassion — hiding a strange fugitive with three arms — draws them into a deeper conspiracy. Rumors spread of escaped miners plotting rebellion, but the truth is far worse: the “mutated” workers are actually alien infiltrators known as Genestealers, heralding a coming Tyranid invasion.",
  [normalize("DND NO NAME (SANDBOX GAME)")]:
    "Set on an island scarred by an ancient demon invasion, adventurers take on deadly guild missions to rise through the ranks of a fractured society. The orcs, once guardians of the Abyssal Gate, have fallen into decline, and corruption spreads as gnolls prepare to summon Yeenoghu. Torn between ambition and survival, the party must choose whether to succumb to the island's decay or stop the Lord of Savagery — while a cunning rakshasa plots his own conquest through politics and the thieves guild."
};

// ---- Subsection labels (constants) ----
const CARD_GAME_LABEL = "Satirical Parody Card Game (85 Cards, 5 Versions)";
const POKEWEB_LABEL = "PokéWeb (Django REST API)";
const ELEARNX_LABEL = "ElearnX (Django REST + Channels + Redis)";
const GA_SIM_LABEL = "Genetic Algorithm Creature Simulation";
const MOVIEFORGE_LABEL = "MovieForge (.NET Web API)";
const PROJECT_HR_LABEL =
  "PROJECT-HR (Multi-Tenant HR Platform - .NET 9 + ABP Framework)";

export function ContentPanel({
  active,
  picked,
}: {
  active: SectionKey;
  picked: string | null;
}) {
  // decide whether to render course video snippets
  const resolveSubsection = (p: string | null): string | null => {
    if (!p) return null;
    const n = normalize(p);
    const u2dA = normalize("Complete C# Unity Game Developer 2D");
    const u2dB = normalize("Complete C# Unity Game Developer 2D Course");
    if (n === "unity_2d" || n === u2dA || n === u2dB) return CourseSubsections.UNITY_2D;
    if (n === "unity_25d_rpg" || n === normalize(CourseSubsections.UNITY_25D_RPG))
      return CourseSubsections.UNITY_25D_RPG;
    return null;
  };

  const subsectionLabel = resolveSubsection(picked);
  const showGameSnippets = active === "GAME" && !!subsectionLabel;

  // detect the card-game subsection
  const isCardGame =
    active === "GAME" &&
    picked !== null &&
    eq(picked, CARD_GAME_LABEL);

  // ✅ D&D image gallery route
  const isDndWorld = active === "DND";

  // ✅ WEB gallery: add PROJECT-HR into the allowed list
  const isWebGallery =
    active === "WEB" &&
    picked !== null &&
    (eq(picked, POKEWEB_LABEL) ||
      eq(picked, ELEARNX_LABEL) ||
      eq(picked, GA_SIM_LABEL) ||
      eq(picked, MOVIEFORGE_LABEL) ||
      eq(picked, PROJECT_HR_LABEL));

  // ✅ Build per-section gallery items
  const webGalleryItems =
    isWebGallery
      ? webShowcase.filter((w: any) => eq(String(w.subsection ?? ""), picked!))
      : [];

  const cardGameItems =
    isCardGame
      ? gameDevSnippets.filter(
          (s) =>
            eq(String(s.subsection), CARD_GAME_LABEL) &&
            (s as any).image
        )
      : [];

  // 🔧 filter DnD items by the picked subsection
  const dndItems =
    isDndWorld && picked
      ? dndShowcase.filter((it: any) => eq(String(it.subsection ?? ""), picked))
      : [];

  // ✅ Unify the gallery data
  const galleryItems =
    isCardGame ? cardGameItems :
    isDndWorld ? dndItems :
    isWebGallery ? webGalleryItems :
    [];

  // Lightbox state
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () =>
      setOpenIdx((i) =>
        i === null || galleryItems.length === 0
          ? null
          : (i + galleryItems.length - 1) % galleryItems.length
      ),
    [galleryItems.length]
  );
  const next = useCallback(
    () =>
      setOpenIdx((i) =>
        i === null || galleryItems.length === 0
          ? null
          : (i + 1) % galleryItems.length
      ),
    [galleryItems.length]
  );

  // keyboard navigation when lightbox open
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, close, prev, next]);

  const getDescription = (): string => {
    if (!picked) {
      if (active === "DND") return "• " + SECTION_DESCRIPTIONS[normalize("DND")];
      if (active === "WEB") return "• " + SECTION_DESCRIPTIONS[normalize("WEB")];
      if (active === "GAME") return "Pick a subsection on the right to see videos and details.";
      return "• ";
    }
    const pickedKey = normalize(picked);
    const subDesc = SUBSECTION_DESCRIPTIONS[pickedKey];
    if (subDesc) return "• " + subDesc;
    const secDesc = SECTION_DESCRIPTIONS[pickedKey];
    if (secDesc) return "• " + secDesc;
    return "• " + picked;
  };

  // ✅ Pass picked to AboutPanel so it can show "CV" or "Certificates"
  if (active === "ABOUT") {
    return <AboutPanel picked={picked} />;
  }

  const showGallery = isCardGame || isDndWorld || isWebGallery;

  // Use landscape aspect for WEB & DND galleries (charts/maps), portrait for card-game art
  const thumbAspect =
    isWebGallery || isDndWorld ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <motion.div
      key={active + (picked ?? "")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border p-6 shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm uppercase tracking-wide mb-2 text-[var(--muted)]">
        Currently Viewing
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {picked ??
          (active === "DND"
            ? "The World (Homebrew Setting Overview)"
            : active === "WEB"
            ? "Software Development"
            : "")}
      </h3>

      <div
        className="mb-4 text-[var(--muted)]"
        dangerouslySetInnerHTML={{ __html: getDescription() }}
      />

      {active === "GAME" && (
        <div className="text-xs mb-3 opacity-70">
        </div>
      )}

      {/* content region */}
      {showGallery ? (
        <>
          {/* Shared Image grid (clickable) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryItems.map((c: any, i: number) => (
              <button
                key={c.id ?? i}
                onClick={() => setOpenIdx(i)}
                className="text-left rounded-2xl overflow-hidden border bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: "var(--border)" }}
                title={c.title}
              >
                <img
                  src={(c as any).image || (c as any).src}
                  alt={c.title}
                  loading="lazy"
                  className={`${thumbAspect} w-full object-cover`}
                />
                <div className="p-3">
                  <div className="font-medium">{c.title}</div>
                  <p className="text-sm text-[var(--muted)]">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Shared Lightbox */}
          <AnimatePresence>
            {openIdx !== null && galleryItems[openIdx] && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                <motion.div
                  className="relative max-w-6xl w-[94vw] max-h-[88vh] rounded-2xl overflow-hidden bg-[var(--card)]"
                  initial={{ scale: 0.98, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.98, y: 10, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={((galleryItems[openIdx] as any).image || (galleryItems[openIdx] as any).src)}
                    alt={galleryItems[openIdx].title}
                    className="w-full h-full object-contain bg-black"
                    style={{ maxHeight: "78vh" }}
                  />

                  <div className="flex items-center justify-between gap-2 p-3 text-sm">
                    <span className="truncate text-[var(--muted)]">
                      {galleryItems[openIdx].title} — {galleryItems[openIdx].desc}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prev}
                        className="rounded-xl border px-3 py-1"
                        style={{ borderColor: "var(--border)" }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={next}
                        className="rounded-xl border px-3 py-1"
                        style={{ borderColor: "var(--border)" }}
                      >
                        ▶
                      </button>
                      <button
                        onClick={close}
                        className="rounded-xl border px-3 py-1"
                        style={{ borderColor: "var(--border)" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : showGameSnippets ? (
        <GameDevSnippets subsection={subsectionLabel!} />
      ) : active === "GAME" ? (
        <div className="text-sm text-[var(--muted)]"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-sm text-[var(--muted)]">Snippet {i + 1}</div>
              <div className="mt-2 font-medium">GLORP-TEXT: ZAZZ ZIZZ ZUZZ</div>
              <p className="text-sm text-[var(--muted)] mt-1">
                Replace with meaningful bits: achievements, links, screenshots, code doo-dads.
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ContentPanel;
