import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next already ignores .next/**, out/**, build/** and
// next-env.d.ts; node_modules is always ignored by ESLint.
export default defineConfig([...nextVitals, ...nextTs]);
