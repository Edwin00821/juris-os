import { baseConfig } from "@juris-os/config/vitest.base";
import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
	// The React plugin lets `.tsx` component tests render with JSX. Component
	// tests opt into the DOM per-file via a `// @vitest-environment jsdom`
	// comment; pure-logic tests stay on the inherited `node` environment.
	plugins: [react()],
	test: {
		// Unit tests for the web app (utilities, hooks logic). Playwright specs under
		// `e2e/` are excluded by the base config.
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
	},
});
