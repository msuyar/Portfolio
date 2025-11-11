// src/App.tsx
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Footer } from "./components/layout/Footer";
import { LeftNav } from "./components/panels/LeftNav";
import { MiddleQualifications } from "./components/panels/MiddleQualifications";
import { RightSubsections } from "./components/panels/RightSubsections";
import { ContentPanel } from "./components/panels/ContentPanel";
import { D20RollOverlay } from "./components/transitions/D20RollOverlay";
import { UniversalTransition } from "./components/transitions/UniversalTransition";
import { ShuffleTransition } from "./components/transitions/ShuffleTransition";
import AboutStarfallTransition from "./components/transitions/AboutStarfallTransition";
import Starfield from "./components/backgrounds/Starfield";
import type { SectionKey } from "./config/sections";
import type { TransitionKind } from "./types/transitions";
import { SUBSECTIONS } from "./config/data";
import { asset } from "./lib/asset"; // <-- IMPORTANT

export default function App() {
  const [active, setActive] = useState<SectionKey>("ABOUT");
  const [picked, setPicked] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<TransitionKind>(null);

  function nudgeResize() {
    // fire a few times to catch post-animation layout
    window.dispatchEvent(new Event("resize"));
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
  }

  // Ensure a valid subsection is always chosen for the current section
  useEffect(() => {
    const list = SUBSECTIONS[active] ?? [];
    if (!list.length) {
      if (picked !== null) setPicked(null);
      return;
    }
    if (!picked || !list.includes(picked)) {
      setPicked(list[0]); // auto-pick first subsection
    }
  }, [active, picked]);

  function handleSelect(section: SectionKey) {
    if (section === active) return;

    // choose overlay based on target section
    if (section === "DND") setOverlay("d20");
    else if (section === "WEB") setOverlay("universal");
    else if (section === "GAME") setOverlay("shuffle");
    else if (section === "ABOUT") setOverlay("elemental");

    // immediately pick the first subsection of the next section
    const firstOfNext = SUBSECTIONS[section]?.[0] ?? null;
    setPicked(firstOfNext);
    setActive(section);
  }

  const isDnd = active === "DND";
  const isGame = active === "GAME";
  const isAbout = active === "ABOUT";
  const isWeb = active === "WEB";

  return (
    <div
      data-section={active}
      className={`relative min-h-screen flex flex-col text-[var(--fg)] ${
        isDnd || isGame || isAbout ? "" : "bg-[var(--bg)]"
      }`}
      style={
        isDnd
          ? {
              backgroundImage: `
                url('${asset("media/parchment.png")}'),
                url('${asset("media/parchment2.png")}')
              `,
              backgroundSize: "cover, auto",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, repeat",
              backgroundBlendMode: "multiply, normal",
            }
          : isGame
          ? {
              backgroundImage: `url('${asset("media/GameDevBackground.png")}')`,
              backgroundRepeat: "repeat",
              backgroundPosition: "top left",
              backgroundSize: "auto",
            }
          : isWeb
          ? undefined // WEB handled by gradients below
          : undefined // ABOUT handled by Starfield below
      }
    >
      {/* BACKGROUND LAYERS */}
      {isDnd && (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[rgba(255,255,240,0.35)] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 z-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.25)]" />
        </>
      )}

      {isGame && (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[rgba(0,0,0,0.25)]" />
          <div className="pointer-events-none absolute inset-0 z-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.35)]" />
        </>
      )}

      {/* ABOUT uses crisp starfield instead of static image */}
      {isAbout && (
        <>
          <Starfield
            look="sharp"
            opacity={0.7}
            density={1.25}
            driftMax={2}
            twinkle={false}
            parallax
            className="z-0"
          />
          <div className="pointer-events-none absolute inset-0 z-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.25)]" />
        </>
      )}

      {isWeb && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(800px 400px at 20% -10%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%), " +
              "radial-gradient(900px 500px at 110% 10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />
      )}

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <LeftNav active={active} onSelect={handleSelect} />
            </div>

            <div className="md:col-span-6 space-y-6">
              <MiddleQualifications active={active} />
              <AnimatePresence mode="wait">
                <ContentPanel
                  key={active + (picked ?? "")}
                  active={active}
                  picked={picked}
                />
              </AnimatePresence>
            </div>

            <div className="md:col-span-3 space-y-4">
              <RightSubsections
                active={active}
                selected={picked}
                onPick={setPicked}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* TRANSITIONS */}
      <AnimatePresence>
        {overlay === "d20" && <D20RollOverlay onDone={() => setOverlay(null)} />}
        {overlay === "universal" && (
          <UniversalTransition onDone={() => setOverlay(null)} />
        )}
        {overlay === "shuffle" && (
          <ShuffleTransition onDone={() => setOverlay(null)} />
        )}

        <AboutStarfallTransition
          show={overlay === "elemental"}
          durationMs={900}
          accent="#8ab6ff"
          name="Muhammed Said Uyar"
          onComplete={() =>{ 
            nudgeResize();
            setOverlay(null)}}
        />
      </AnimatePresence>
    </div>
  );
}
