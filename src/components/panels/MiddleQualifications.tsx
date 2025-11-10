import { QUALIFICATIONS } from "../../config/data";
import { SECTIONS, type SectionKey } from "../../config/sections";

export function MiddleQualifications({ active }: { active: SectionKey }) {
  const list = QUALIFICATIONS[active];
  return (
    <div
      className="rounded-3xl border p-5 shadow-sm min-h-[320px]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm uppercase tracking-wide mb-2 text-[var(--muted)]">Qualifications</div>
      <h2 className="text-2xl font-semibold mb-4">{SECTIONS[active]}</h2>
      <ul className="space-y-2">
        {list.map((q, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 w-2 h-2 rounded-full inline-block" style={{ background: "var(--fg)" }} />
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
