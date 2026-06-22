import { baseConfig } from "@juris-os/config/vitest.base";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
	test: {
		include: ["src/**/*.test.ts"],
	},
});
