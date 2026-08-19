import { ADSTERRA_BANNER_SLOTS, type AdsterraBannerSlot } from "./adsterra-slots";

export function AdsterraBanner({ slot }: { slot: AdsterraBannerSlot }) {
  const { htmlPath, width, height } = ADSTERRA_BANNER_SLOTS[slot];

  return (
    <div className="flex justify-center">
      <iframe
        src={htmlPath}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: "none" }}
        title="Advertisement"
      />
    </div>
  );
}
