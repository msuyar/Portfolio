// src/components/layout/ParchmentPage.tsx
import React from "react";
import clsx from "clsx";

export default function ParchmentPage({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "min-h-screen w-full relative",
        enabled
          ? "bg-[url('/media/parchment.png')] bg-cover bg-center bg-no-repeat"
          : "bg-[var(--app-bg)]"
      )}
    >
      {enabled && (
        <>
          {/* warm wash so parchment isn’t too contrasty */}
          <div className="pointer-events-none absolute inset-0 bg-[rgba(255,255,240,0.35)] mix-blend-multiply" />
          {/* subtle vignette at edges */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.25)]" />
        </>
      )}

      {/* content sits above the background */}
      <div className="relative">{children}</div>
    </div>
  );
}
