import { baseConfig } from "@juris-os/config/vitest.base";
import { mergeConfig } from "vitest/config";

// Real-Postgres integration suite. Kept separate from the default `test` run so
// `npm run test` stays fast and DB-free; this one requires a running Postgres
// (npm run db:start). Run with `npm run test:integration` from apps/api-gateway.
export default mergeConfig(baseConfig, {
	test: {
		include: ["src/**/*.integration.test.ts"],
		// One file at a time: the suites share a single test database.
		fileParallelism: false,
		// DB bootstrap (CREATE DATABASE + migrations) runs in beforeAll.
		hookTimeout: 60000,
		testTimeout: 30000,
	},
});
