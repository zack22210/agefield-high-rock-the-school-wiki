import {
  BookOpen,
  CalendarDays,
  Gamepad2,
  MessageCircle,
  MonitorPlay,
  ShoppingCart,
  Star,
  Tags,
  type LucideIcon,
} from "lucide-react";

export const NAVIGATION_CONFIG: ReadonlyArray<{
  key: string;
  path: string;
  icon: LucideIcon;
  isContentType: boolean;
}> = [
  { key: "guide", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "release", path: "/release", icon: CalendarDays, isContentType: true },
  { key: "platforms", path: "/platforms", icon: Gamepad2, isContentType: true },
  { key: "purchase", path: "/purchase", icon: ShoppingCart, isContentType: true },
  { key: "reviews", path: "/reviews", icon: Star, isContentType: true },
  { key: "media", path: "/media", icon: MonitorPlay, isContentType: true },
  { key: "details", path: "/details", icon: Tags, isContentType: true },
  { key: "community", path: "/community", icon: MessageCircle, isContentType: true },
];

// Player-first navigation for the header and the compact homepage sidebar.
// The full content taxonomy above remains the source of truth for routes,
// sitemap generation, and article-page navigation.
export const HOME_NAVIGATION_CONFIG = [
  { key: "guide", path: "/guide" },
  { key: "missions", path: "/guide/agefield-high-rock-the-school-haunted-house-mission" },
  { key: "characters", path: "/details/agefield-high-rock-the-school-characters" },
  { key: "endings", path: "/guide/agefield-high-rock-the-school-ashley-ending" },
  { key: "platforms", path: "/platforms" },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
