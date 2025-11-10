// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[color:rgba(255,255,255,.8)] border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* avatar */}
          <img
            src="/media/profile.jpg"   // <- your image in /public/media/
            alt="Muhammed Said Uyar headshot"
            className="w-40 h-40 rounded-full object-cover ring-1 ring-[var(--border)]"
            loading="eager"
          />

          {/* name + tagline */}
          <div className="leading-tight">
            <div className="text-lg font-semibold">Muhammed Said Uyar</div>
            <div className="text-xs text-[var(--muted)]">Software Developer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
