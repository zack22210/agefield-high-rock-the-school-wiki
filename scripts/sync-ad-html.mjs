#!/usr/bin/env node
/**
 * Generate the fixed-size Adsterra HTML pages from NEXT_PUBLIC_AD_* values.
 * Native Banner uses a different provider script and remains managed separately.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..");
const outputDir = join(root, "public", "ads");

const formats = {
  "320x50": { width: 320, height: 50, env: "NEXT_PUBLIC_AD_MOBILE_320X50", file: "banner-320x50.html" },
  "300x250": { width: 300, height: 250, env: "NEXT_PUBLIC_AD_BANNER_300X250", file: "banner-300x250.html" },
  "728x90": { width: 728, height: 90, env: "NEXT_PUBLIC_AD_BANNER_728X90", file: "banner-728x90.html" },
  "468x60": { width: 468, height: 60, env: "NEXT_PUBLIC_AD_BANNER_468X60", file: "banner-468x60.html" },
  "160x600": { width: 160, height: 600, env: "NEXT_PUBLIC_AD_SIDEBAR_160X600", file: "sidebar-160x600.html" },
  "160x300": { width: 160, height: 300, env: "NEXT_PUBLIC_AD_SIDEBAR_160X300", file: "sidebar-160x300.html" },
};

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const name = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (value && !process.env[name]) process.env[name] = value;
    }
  } catch {
    // Optional environment file.
  }
}

loadEnvFile(join(root, ".env.local"));
loadEnvFile(join(root, ".env.production"));
loadEnvFile(join(root, ".env.development"));
loadEnvFile(join(root, ".env"));

function buildHtml(key, width, height) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      window.atOptions = {
        key: "${key}",
        format: "iframe",
        width: ${width},
        height: ${height},
        params: {},
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
  </body>
</html>
`;
}

let generated = 0;

for (const [format, spec] of Object.entries(formats)) {
  const key = process.env[spec.env]?.trim();
  if (!key || key === "0") {
    console.warn(`skip ${spec.file} (${spec.env} is not configured)`);
    continue;
  }
  if (!/^[a-f0-9]{32}$/i.test(key)) {
    throw new Error(`${spec.env} must be a 32-character hexadecimal banner key`);
  }
  writeFileSync(join(outputDir, spec.file), buildHtml(key, spec.width, spec.height));
  console.log(`wrote ${spec.file} (${format})`);
  generated++;
}

if (generated === 0) {
  console.warn("No fixed-size banner HTML was generated.");
}
