import { expect, test } from "@playwright/test";

/**
 * Phase 0 Playwright smoke test: confirms the toolchain boots the app and the
 * sign-in page renders. The full role-based journeys land in Phase 3.
 */
test("sign-in page loads", async ({ page }) => {
	await page.goto("/sign-in");
	await expect(page).toHaveTitle(/.+/);
});
