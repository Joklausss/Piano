// Déploiement GitHub Pages : export statique + basePath /Piano (activé par la CI
// via la variable GITHUB_PAGES). En local, l'app reste à la racine.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "Piano";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isPages
    ? {
        output: "export",
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/sw.js",
              headers: [
                { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                { key: "Service-Worker-Allowed", value: "/" },
              ],
            },
          ];
        },
      }),
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "",
  },
};

export default nextConfig;
