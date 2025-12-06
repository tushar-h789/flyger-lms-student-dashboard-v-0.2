import type { NextConfig } from "next";

// Log relevant environment variables at server startup (secrets masked)
const logEnvOnStart = () => {
  try {
    const names = [
      "NEXT_PUBLIC_LOGTO_ENDPOINT",
      "NEXT_PUBLIC_LOGTO_APP_ID",
      "LOGTO_APP_SECRET",
      "NEXT_PUBLIC_API_URL",
    ];

    // Mask secret-like values so we don't leak sensitive data in logs
    const mask = (name: string, value: string | undefined) => {
      if (!value) return "undefined";
      if (name.toLowerCase().includes("secret")) {
        if (value.length <= 4) return "****";
        return `${value.slice(0, 2)}***${value.slice(-2)}`;
      }
      return value;
    };

    // Only log once at config evaluation
    console.log("=== Server startup: env check ===");
    for (const n of names) {
      console.log(`${n}:`, mask(n, process.env[n]));
    }
    console.log("=== End env check ===");
  } catch (e) {
    console.log("Env logging failed:", e);
  }
};

logEnvOnStart();

const nextConfig: NextConfig = {
  // basePath: '/student',
  images: {
    domains: ["media.licdn.com", "localhost", "imgs.search.brave.com"],
  },
  output: "standalone",
  // reactStrictMode: true,
  // swcMinify: true,
};
export default nextConfig;
