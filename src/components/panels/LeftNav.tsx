import {
  SECTION_ORDER,
  SECTIONS,
  SectionIcon,
  type SectionKey,
} from "../../config/sections";
import { asset } from "../../lib/asset";

export function LeftNav({
  active,
  onSelect,
}: {
  active: SectionKey;
  onSelect: (s: SectionKey) => void;
}) {
  return (
    <nav className="space-y-2 pr-2">
      {/* 🧑‍💻 Profile image on top */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={asset("media/profile.jpg")}
          alt="Muhammed Said Uyar"
          className="w-60 h-60 rounded-full object-cover border-2 border-[var(--border)] shadow-sm mb-2"
        />
        {/* Name */}
        <div
          className={`text-base sm:text-lg font-semibold text-center transition-colors ${
            active === "WEB" ? "text-black" : "text-white"
          }`}
        >
          Muhammed Said Uyar
        </div>

        <div
          className={`text-sm sm:text-base text-center transition-colors ${
            active === "WEB" ? "text-black/70" : "text-white/80"
          }`}
        >
          Software & Game Developer
        </div>
      </div>

      {SECTION_ORDER.map((key) => {
        const selected = active === key;

        // 🐉 D&D button (half-width, same height, big logo)
        if (key === "DND") {
          return (
            <div key={key} className="flex justify-end">
              <button
                onClick={() => onSelect(key)}
                className={`relative flex items-center justify-center w-1/2 rounded-2xl px-3 py-3 border transition-all shadow-sm overflow-hidden
                  ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]"
                      : "border-[var(--border)] bg-white hover:bg-[var(--border)]/30"
                  }`}
                aria-label="Dungeons & Dragons"
              >
                <div className="invisible flex items-center gap-3">
                  <span className="w-5 h-5" />
                  <span className="text-sm leading-none">
                    Dungeons &amp; Dragons
                  </span>
                </div>
                <img
                  src={
                    selected
                      ? asset("media/DnDLogo_Alternative.png")
                      : asset("media/DnDLogo.png")
                  }
                  alt="Dungeons & Dragons"
                  className="absolute inset-0 m-auto object-contain scale-[2.2] sm:scale-[2.4] h-10 w-10 pointer-events-none"
                />
              </button>
            </div>
          );
        }

        // 🧱 Default buttons
        const Icon = SectionIcon[key];
        const label = SECTIONS[key];

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 border text-left transition shadow-sm"
            style={{
              background: selected ? "var(--accent)" : "white",
              color: selected ? "white" : "var(--fg)",
              borderColor: selected ? "var(--accent)" : "var(--border)",
            }}
          >
            <Icon className="w-5 h-5" />
            <div>
              <div className="font-medium leading-none">{label}</div>
              <div className="text-xs opacity-0 select-none">placeholder</div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
