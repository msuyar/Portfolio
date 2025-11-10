import { BookOpen, Gamepad2, Globe } from "lucide-react";

export const SECTIONS = {
  WEB: "Software Development",
  GAME: "Game Development",
  DND: "Dungeons & Dragons",
  ABOUT: "About Me",
} as const;

export type SectionKey = keyof typeof SECTIONS;

export const SECTION_ORDER: SectionKey[] = ["ABOUT", "WEB", "GAME", "DND"];

export const SectionIcon: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  GAME: Gamepad2,
  WEB: Globe,
  ABOUT: BookOpen,
  DND: BookOpen,
};

