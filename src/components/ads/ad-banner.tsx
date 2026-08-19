import { getBannerConfig } from "@/lib/ad-config";
import { isValidAdKey } from "@/config/ad-keys";
import { type AdBannerType } from "./ad-banner-types";

export function AdBanner({
  type,
  adKey,
  eager,
}: {
  type: AdBannerType;
  adKey?: string;
  eager?: boolean;
}) {
  if (type === "native-banner-4x1") {
    if (!isValidAdKey(adKey)) return null;
    return (
      <div className="flex justify-center">
        <iframe
          src={`/ads/native-banner-4x1.html?key=${encodeURIComponent(adKey!.trim())}`}
          width={728}
          height={182}
          scrolling="no"
          style={{ border: "none" }}
          title="Advertisement"
          loading={eager ? "eager" : "lazy"}
        />
      </div>
    );
  }

  const format = type.replace("banner-", "").replace("sidebar-", "") as Parameters<typeof getBannerConfig>[0];
  const { htmlPath, width, height } = getBannerConfig(format);

  return (
    <div className="flex justify-center">
      <iframe
        src={htmlPath}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: "none" }}
        title="Advertisement"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
