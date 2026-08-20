"use client";

import { useMemo, useState } from "react";
import { Bike, Building2, CircleDollarSign, Disc3, GraduationCap, MapPin, ShoppingBag, Star } from "lucide-react";

const filters = ["All", "School", "Shops", "Bikes", "Missions", "Side Missions", "Autographs", "Burned CDs", "Magazines", "Golden", "Apple Pies", "Food", "Cash"] as const;
type Filter = (typeof filters)[number];

const landmarks: Array<{
  name: string;
  zone: string;
  x: number;
  y: number;
  categories: Filter[];
  detail: string;
}> = [
  { name: "Agefield High", zone: "School Campus", x: 48, y: 24, categories: ["School", "Missions", "Side Missions"], detail: "Classes, the Seth fight, Bad Grades, and school missions." },
  { name: "Town Center", zone: "Town Center", x: 50, y: 53, categories: ["Shops", "Food", "Cash", "Magazines"], detail: "Main shopping and social hub; restock food and spend mission cash." },
  { name: "Mike's Bike Shop", zone: "Town Center", x: 68, y: 48, categories: ["Shops", "Bikes", "Missions"], detail: "Bike mission hub and the place to work toward the full bike collection." },
  { name: "Ashley’s House", zone: "East Neighborhood", x: 78, y: 27, categories: ["Missions", "Side Missions"], detail: "Backyard and pool approach for the early Ashley house dare." },
  { name: "Sam’s House", zone: "West Neighborhood", x: 19, y: 37, categories: ["Missions", "Bikes"], detail: "Home base, wardrobe, garage, and reliable bike recovery point." },
  { name: "Haunted House", zone: "West Neighborhood", x: 17, y: 67, categories: ["Missions", "Side Missions"], detail: "Mission location; check prerequisites before entering the area." },
  { name: "Park and Playground", zone: "Town Center", x: 37, y: 65, categories: ["Missions", "Side Missions", "Autographs"], detail: "Crew meetings, Laura encounter, and exploration pickups." },
  { name: "Countryside", zone: "Countryside", x: 75, y: 77, categories: ["Side Missions", "Burned CDs", "Golden", "Apple Pies"], detail: "Outlying roads and open ground suited to bike searches and collectibles." },
  { name: "Neighborhood Routes", zone: "Neighborhoods", x: 31, y: 44, categories: ["Autographs", "Burned CDs", "Magazines", "Golden", "Apple Pies", "Food", "Cash"], detail: "Search alleys, yards, and connecting roads for collectible sets and resources." },
];

function MarkerIcon({ categories }: { categories: Filter[] }) {
  if (categories.includes("School")) return <GraduationCap aria-hidden="true" />;
  if (categories.includes("Bikes")) return <Bike aria-hidden="true" />;
  if (categories.includes("Shops")) return <ShoppingBag aria-hidden="true" />;
  if (categories.includes("Cash")) return <CircleDollarSign aria-hidden="true" />;
  if (categories.includes("Burned CDs")) return <Disc3 aria-hidden="true" />;
  if (categories.includes("Autographs")) return <Star aria-hidden="true" />;
  if (categories.includes("Missions")) return <Building2 aria-hidden="true" />;
  return <MapPin aria-hidden="true" />;
}

export function AgefieldMap() {
  const [active, setActive] = useState<Filter>("All");
  const visible = useMemo(
    () => landmarks.filter((landmark) => active === "All" || landmark.categories.includes(active)),
    [active],
  );

  return (
    <section className="not-prose my-8" aria-labelledby="agefield-map-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="agefield-map-title" className="text-xl font-bold text-foreground sm:text-2xl">Agefield location map</h2>
          <p className="text-body mt-1 max-w-2xl text-sm leading-6">A route-planning diagram based on confirmed areas and walkthrough locations. Marker positions are approximate, not an extracted in-game map.</p>
        </div>
        <p className="text-meta text-sm tabular-nums" aria-live="polite">{visible.length} locations shown</p>
      </div>

      <div className="mobile-scroll-x mb-4 flex gap-2 pb-1" role="group" aria-label="Filter map locations">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            onClick={() => setActive(filter)}
            className={`touch-target shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${active === filter ? "bg-[hsl(var(--nav-theme-light))] text-[hsl(215_55%_12%)]" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-[0_18px_55px_-28px_hsl(215_70%_2%/0.9)]">
        <div className="relative min-h-[31rem] overflow-hidden bg-[hsl(215_31%_11%)] sm:min-h-[35rem]" aria-label="Schematic map of Agefield">
          <div className="absolute inset-x-[7%] top-[12%] h-[19%] rounded-[2rem] bg-[hsl(215_40%_19%)]" />
          <div className="absolute inset-x-[9%] top-[41%] h-[25%] rounded-[2.25rem] bg-[hsl(42_31%_17%)]" />
          <div className="absolute bottom-[6%] left-[45%] right-[5%] h-[21%] rounded-[45%_18%_20%_30%] bg-[hsl(133_22%_17%)]" />
          <div className="absolute bottom-[12%] left-[5%] top-[25%] w-[26%] rounded-[2rem] bg-[hsl(215_26%_15%)]" />
          <div className="absolute left-[5%] right-[5%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-[hsl(215_12%_36%)]" />
          <div className="absolute bottom-[5%] left-1/2 top-[8%] w-2 -translate-x-1/2 rounded-full bg-[hsl(215_12%_34%)]" />
          <span className="absolute left-[10%] top-[14%] text-xs font-bold uppercase tracking-[0.16em] text-[hsl(215_22%_70%)]">School Campus</span>
          <span className="absolute left-[12%] top-[44%] text-xs font-bold uppercase tracking-[0.16em] text-[hsl(43_28%_72%)]">Town Center</span>
          <span className="absolute bottom-[8%] right-[8%] text-xs font-bold uppercase tracking-[0.16em] text-[hsl(133_24%_70%)]">Countryside</span>

          {visible.map((landmark) => (
            <button
              key={landmark.name}
              type="button"
              style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--nav-theme-light))] p-2 text-[hsl(215_55%_12%)] shadow-[0_8px_20px_-8px_hsl(43_92%_55%/0.8)] transition hover:scale-110 focus-visible:scale-110 [&>svg]:h-4 [&>svg]:w-4"
              aria-label={`${landmark.name}, ${landmark.zone}. ${landmark.detail}`}
            >
              <MarkerIcon categories={landmark.categories} />
              <span className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 hidden w-52 -translate-x-1/2 rounded-xl bg-popover p-3 text-left text-xs leading-5 text-popover-foreground shadow-[0_12px_30px_-12px_hsl(215_70%_2%/0.95)] group-hover:block group-focus-visible:block">
                <strong className="block text-sm">{landmark.name}</strong>
                <span className="text-muted-foreground">{landmark.detail}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-2">
          {visible.map((landmark) => (
            <div key={`${landmark.name}-legend`} className="min-w-0 bg-card px-4 py-3">
              <p className="font-semibold text-foreground">{landmark.name}</p>
              <p className="text-body mt-1 text-sm leading-5">{landmark.zone} · {landmark.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
