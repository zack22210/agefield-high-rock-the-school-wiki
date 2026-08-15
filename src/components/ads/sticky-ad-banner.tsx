"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

const MOBILE_BANNER_KEY = getAdKey("MOBILE_320X50");

export function StickyAdBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isValidAdKey(MOBILE_BANNER_KEY) || dismissed) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(0.5rem,var(--safe-bottom))]">
      <div className="pointer-events-auto relative mx-auto w-full max-w-[320px] shadow-xl">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="touch-target absolute left-1/2 top-0 z-10 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-background text-muted-foreground shadow-lg transition hover:text-foreground"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="overflow-hidden">
          <AdBanner type="banner-320x50" adKey={MOBILE_BANNER_KEY} eager />
        </div>
      </div>
    </div>
  );
}
