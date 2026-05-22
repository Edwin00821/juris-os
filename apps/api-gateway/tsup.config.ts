import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./api/index.ts"],
	format: ["esm"],
	outDir: "dist",
	clean: true,
	bundle: true,
	splitting: false,
	noExternal: [/@juris-os\/.*/],
});
