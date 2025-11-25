// src/lib/dndRig.ts

const KEY = "dnd_rig_state_v2";

/**
 * Roll rigging logic:
 * 1st roll  -> ALWAYS nat 1
 * 2nd roll  -> ALWAYS guaranteed success (15)
 * 3rd+ roll -> no rig, return null (normal random)
 */
export function getRiggedDndRoll(): number | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(KEY);
  const count = raw ? Number(raw) || 0 : 0;

  // First roll: automatic failure (nat 1)
  if (count === 0) {
    window.localStorage.setItem(KEY, "1");
    return 1;
  }

  // Second roll: guaranteed success (not random!)
  if (count === 1) {
    window.localStorage.setItem(KEY, "2");
    return 15; // high enough to always beat DC 10
  }

  // Third+ attempts: no rigging
  return null;
}

/** Dev helper (optional) */
export function resetRiggedDndRollState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
