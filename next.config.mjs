import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://www.agefieldhighrocktheschool.online/:path*",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "agefieldhighrocktheschool.online" }],
        destination: "https://www.agefieldhighrocktheschool.online/:path*",
        statusCode: 301,
      },
      { source: "/guide/agefield-high-rock-the-school-walkthrough", destination: "/guide", statusCode: 301 },
      { source: "/guide/agefield-high-rock-the-school-true-ending", destination: "/guide/agefield-high-rock-the-school-ashley-ending", statusCode: 301 },
      { source: "/platforms/agefield-high-rock-the-school-xbox", destination: "/release/agefield-high-rock-the-school-xbox-release-date", statusCode: 301 },
      { source: "/platforms/agefield-high-rock-the-school-ps5", destination: "/release/agefield-high-rock-the-school-ps5-release-date", statusCode: 301 },
      { source: "/platforms/agefield-high-rock-the-school-nintendo-switch", destination: "/platforms/agefield-high-rock-the-school-switch-2", statusCode: 301 },
      { source: "/details/agefield-high-rock-the-school-game-size", destination: "/details/agefield-high-rock-the-school-length", statusCode: 301 },
      { source: "/release/agefield-high-rock-the-school-console-release-date", destination: "/release/agefield-high-rock-the-school-release-date", statusCode: 301 },
      { source: "/release/agefield-high-rock-the-school-early-access", destination: "/release/agefield-high-rock-the-school-release-date", statusCode: 301 },
      { source: "/reviews/agefield-high-rock-the-school-ign", destination: "/reviews/agefield-high-rock-the-school-review", statusCode: 301 },
      { source: "/reviews/agefield-high-rock-the-school-metacritic", destination: "/reviews/agefield-high-rock-the-school-review", statusCode: 301 },
    ];
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  allowedDevOrigins: ["*.preview.same-app.com"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));
