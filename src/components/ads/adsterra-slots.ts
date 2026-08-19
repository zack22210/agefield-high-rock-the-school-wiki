import { getBannerConfig } from "@/lib/ad-config";

export const ADSTERRA_BANNER_SLOTS = {
  "728x90": {
    ...getBannerConfig("728x90"),
  },
  "300x250": {
    ...getBannerConfig("300x250"),
  },
  "468x60": {
    ...getBannerConfig("468x60"),
  },
  "160x600": {
    ...getBannerConfig("160x600"),
  },
  "160x300": {
    ...getBannerConfig("160x300"),
  },
  "320x50": {
    ...getBannerConfig("320x50"),
  },
} as const;

export type AdsterraBannerSlot = keyof typeof ADSTERRA_BANNER_SLOTS;
