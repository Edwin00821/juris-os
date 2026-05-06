import path from "node:path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), "../../apps/web/.env");
console.log("🔍 Looking for .env in:", envPath);

dotenv.config({ path: envPath });
console.log("🔑 DATABASE_URL present:", !!process.env.DATABASE_URL);

async function main() {
	const { runAuthSeed } = await import("./auth");

	const SEEDS: Record<string, () => Promise<void>> = {
		auth: runAuthSeed,
	};
	const target = process.argv[2];

	if (!target) {
		console.log("📦 Available seeds:", Object.keys(SEEDS).join(", "));
		console.log("Usage: npx tsx seeds/index.ts <seed>");
		process.exit(0);
	}

	if (target === "all") {
		console.log("🌱 Running all seeds...\n");
		for (const [name, fn] of Object.entries(SEEDS)) {
			console.log(`▶ Running seed: ${name}`);
			await fn();
			console.log(`✅ Seed '${name}' completed\n`);
		}
		console.log("✨ All seeds completed.");
		process.exit(0);
	}

	const seed = SEEDS[target];
	if (!seed) {
		console.error(`❌ Seed '${target}' not found.`);
		console.log("📦 Available:", Object.keys(SEEDS).join(", "));
		process.exit(1);
	}

	console.log(`🌱 Running seed: ${target}\n`);
	await seed();
	console.log(`\n✨ Seed '${target}' completed.`);
	process.exit(0);
}

main().catch((err) => {
	console.error("💥 Seed error:", err);
	process.exit(1);
});
