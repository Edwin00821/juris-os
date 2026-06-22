import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the web app's end-to-end tests (Phase 3).
 *
 * Specs live under `e2e/`. By default Playwright starts the Next.js dev server
 * on port 3001 (matching `npm run dev:web`) and runs the suite against it. Set
 * `PLAYWRIGHT_BASE_URL` to point at an already-running instance instead.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: "npm run dev",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
});
