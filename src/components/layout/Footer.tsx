import { Github, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 border-t border-[var(--border)] bg-[color:rgba(255,255,255,.9)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-sm">
        {/* Left side: email + phone */}
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <a
            href="mailto:saidx35@gmail.com"
            className="inline-flex items-center gap-2 hover:text-[var(--fg)] transition-colors"
          >
            <Mail className="w-4 h-4" /> saidx35@gmail.com
          </a>
          <span className="text-neutral-300">•</span>
          <a
            href="tel:+905469014118"
            className="inline-flex items-center gap-2 hover:text-[var(--fg)] transition-colors"
          >
            <Phone className="w-4 h-4" /> +90 546 901 4118
          </a>
        </div>

        {/* Right side: GitHub */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/msuyar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-[var(--fg)] transition-colors"
            title="View my GitHub profile"
          >
            <Github className="w-4 h-4" />
            <span>/msuyar</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
