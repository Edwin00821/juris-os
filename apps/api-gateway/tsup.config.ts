import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["api/index.ts"],
	format: ["esm"],
	outDir: "dist",
	clean: true,
	noExternal: [/@juris-os\/.*/],
});
