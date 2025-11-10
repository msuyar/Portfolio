// src/content/dndShowcase.ts
import { asset } from "../lib/asset";

export type DndShowcaseItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
  subsection: string; 
};

const WORLD = "The World (Homebrew Setting Overview)";

export const dndShowcase: DndShowcaseItem[] = [
  {
    id: "world-empires",
    title: "The Empires",
    desc:
      "Six empires rise after the Great Cataclysm—each shaped by faith, steel, and ambition.",
    image: asset("media/theworld_empires.png"),
    subsection:
      "ROSEBERRY OPS: THE FEDAILERI CHRONICLES (LINEAR STORY TELLING)",
  },
  {
    id: "world-gods",
    title: "Main Gods of the Setting",
    desc:
      "From Corellon's grace to Asmodeus's infernal rule—divinity mirrors mortal ambition.",
    image: asset("media/theworld_gods.png"),
    subsection:
      "ROSEBERRY OPS: THE FEDAILERI CHRONICLES (LINEAR STORY TELLING)",
  },
  {
    id: "world-religious",
    title: "Religious Organizations",
    desc:
      "Faith turns to power: holy orders, zealots, and prophets of divine will.",
    image: asset("media/theworld_religious.png"),
    subsection:
      "ROSEBERRY OPS: THE FEDAILERI CHRONICLES (LINEAR STORY TELLING)",
  },
];
