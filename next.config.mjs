import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Sem isso, o Next detecta um lockfile solto em C:\Users\User e monta o
  // standalone build aninhado em Documents/r3/Site/Novo/ em vez da raiz.
  outputFileTracingRoot: __dirname,
  basePath: process.env.NEXT_BASE_PATH || undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
