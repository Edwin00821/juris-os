import { defineConfig } from "vitest/config";

/**
 * Shared Vitest base configuration for the monorepo.
 *
 * Workspaces extend this with `mergeConfig` in their own `vitest.config.ts`,
 * overriding only what they need (e.g. `test.environment` or `test.setupFiles`).
 */
export const baseConfig = defineConfig({
	test: {
		globals: true,
		environment: "node",
		// Unit/integration tests only — Playwright e2e specs are excluded so a bare
		// `vitest` run never tries to execute browser specs.
		exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/e2e/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/.next/**",
				"**/e2e/**",
				"**/*.config.*",
				"**/*.d.ts",
			],
		},
	},
});
