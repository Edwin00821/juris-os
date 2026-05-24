import { defineConfig } from "tsup";

export default defineConfig({
	entry: { index: "./src/index.ts" },
	format: ["esm"],
	outDir: "dist",
	clean: true,
	bundle: true,
	splitting: false,

	noExternal: [/@juris-os\/.*/, /^@\//],
	esbuildOptions(options) {
		options.alias = {
			"@": "./src",
		};
	},
});
