import { baseConfig } from "@juris-os/config/vitest.base";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
	test: {
		// Node environment is inherited from the base config; the API gateway has no
		// DOM. Tests live next to the code under `src/**/*.test.ts`.
		include: ["src/**/*.test.ts"],
		// Real-Postgres integration tests run via vitest.integration.config.ts so
		// the default suite stays fast and needs no database.
		exclude: ["**/*.integration.test.ts"],
	},
});
