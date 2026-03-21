import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // setMounted(true) in useEffect([]) is the standard hydration pattern in Next.js.
      // The newer react-hooks plugin flags it, but it is intentional and safe here.
      "react-hooks/exhaustive-deps": "warn",
      // Downgrade no-img-element from error to warn — we use <img> intentionally in some places
      "@next/next/no-img-element": "warn",
      // Downgrade unused-vars from error to warn
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow explicit any where needed (e.g. Lucide icon types)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
