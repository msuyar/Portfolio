import type { SectionKey } from "./sections";

/** ---------------------------
 *  Subsections (Right sidebar)
 *  ---------------------------
 */
export const SUBSECTIONS: Record<SectionKey, string[]> = {
  ABOUT: [
    "What I Use",
    "Resume", 
    "Certificates",
  ],
  GAME: [
    "C# Programming for Unity Game Development Specialization",
    "Complete C# Unity Game Developer 2D",
    "Unity 2.5D Turn-Based RPG",
    "Satirical Parody Card Game (85 Cards, 5 Versions)",
  ],
  WEB: [
    "PROJECT-HR (Multi-Tenant HR Platform - .NET 9 + ABP Framework)",
    "ElearnX (Django REST + Channels + Redis)",
    "PokéWeb (Django REST API)",
    "MovieForge (.NET Web API)",
    "Genetic Algorithm Creature Simulation",
  ],
  DND: [
    "ROSEBERRY OPS: THE FEDAILERI CHRONICLES (LINEAR STORY TELLING)",
    "RETURN-2-BLACK-CITY (MYTHOLOGICAL CAMPAIGN)",
    "YOUNG-VILLAGERS SAGA (LEVEL 3-8 ARC)",
    "DND NO NAME (SANDBOX GAME)",
  ],
};

/** ---------------------------
 *  Middle “Qualifications”
 *  ---------------------------
 */
export const HIGHLIGHTS: Record<SectionKey, string[]> = {
  GAME: [
    "🎮 Unity 2.5D Turn-Based systems",
    "🖼️ Asset pipelines & tooling",
    "📦 Clean architecture for gameplay",
  ],
  WEB: [
    "🌐 React + TypeScript (Vite, Tailwind, Framer Motion)",
    "🧠 Django & ASP.NET Core REST API Design",
    "🗃️ PostgreSQL / SQLite / EF Core",
    "🔐 JWT Auth + Role-Based Access Systems",
    "🧩 AI / GA experiments",
  ],
  DND: [
    "📜 D&D 5E (2014 Ruleset Expertise)",
    "🧠 Custom Items & Homebrew Design",
    "🎲 DM'd Campaigns in Multiple Languages",
    "🗺️ Led Games For 20+ Unique Players",
  ],
};

/** ---------------------------
 *  About page — green blocks
 *  ---------------------------
 */

/** ---------------------------
 *  Qualifications (Middle column)
 *  ---------------------------
 */
export const QUALIFICATIONS: Record<SectionKey, string[]> = {
  ABOUT: [
    "Final-year BSc student at Goldsmiths, University of London",
    "Hands-on experience contributing to full-stack projects (.NET)",
    "Unity prototypes and physics-based GA simulation using PyBullet",
  ],
  GAME: [
    "Unity C# scripting, input systems, physics and AI",
    "Version control with Git; GIF/video capture for demos",
    "Small prototypes shipped with clean, modular code",
  ],
  WEB: [
    ".NET 9 + ABP, EF Core, PostgreSQL; JWT auth and background jobs",
    "Django REST + Channels (WebSockets), Celery tasks, Redis",
    "React + Vite + Tailwind; component-driven UI with Framer Motion",
  ],
  DND: [
    "Campaign design, encounter balance, homebrew items and enemies",
    "Systems thinking and documentation; visual aids and maps",
    "Session prep and iterative worldbuilding with player feedback",
  ],
};

export const ABOUT_SKILLS: string[] = [
  "C#", "C++", "JavaScript", "TypeScript", "Go", "Node.js", "React",
  "Next.js", "Redux", "Docker", "Kubernetes", "PostgreSQL",
  "Python", "Java", "Haskell", "Tailwind CSS", "Material UI",
  "Rust", "AWS", "Kafka", ".NET", "Django", "EF Core", "Unity", "Godot",
];

export const ABOUT_TOOLS: string[] = [
  "Mac OS", "Google Chrome", "VS Code", "IntelliJ IDEA", "Rider", "Postman", "Git",
];

/** Utility so .map never throws on undefined */
export const safeArray = <T,>(v: T[] | undefined | null): T[] =>
  Array.isArray(v) ? v : [];
