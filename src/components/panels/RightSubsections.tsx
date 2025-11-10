import { useEffect } from "react";
import { SUBSECTIONS } from "../../config/data";
import type { SectionKey } from "../../config/sections";

export function RightSubsections({
  active,
  selected,
  onPick,
}: {
  active: SectionKey;
  selected: string | null;
  onPick: (s: string) => void;
}) {
  const list = SUBSECTIONS[active] ?? [];

  // Keep selection valid and default to the first item
  useEffect(() => {
    if (!list.length) {
      if (selected !== null) onPick(null as unknown as string);
      return;
    }
    if (!selected || !list.includes(selected)) {
      onPick(list[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, list.length]);

  return (
    <aside
      className="rounded-3xl border p-4 shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm uppercase tracking-wide mb-2 text-[var(--muted)]">
        Subsections
      </div>
      <ul className="space-y-2">
        {list.map((name) => (
          <li key={name}>
            <button
              onClick={() => onPick(name)}
              className="w-full text-left rounded-xl px-3 py-2 border transition"
              style={{
                background: selected === name ? "var(--accent)" : "var(--card)",
                color: selected === name ? "white" : "var(--fg)",
                borderColor:
                  selected === name ? "var(--accent)" : "var(--border)",
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
