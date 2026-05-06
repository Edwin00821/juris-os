import { createAuthUser } from "../core/create-auth-user";

const AUTH_USERS = [
	{
		name: "Main Admin",
		email: "admin@juris-os.com",
		role: "admin",
		password: "Admin1234!",
	},
	{
		name: "Example Citizen",
		email: "citizen@juris-os.com",
		role: "citizen",
		password: "Citizen1234!",
	},
	{
		name: "Example Judge",
		email: "judge@juris-os.com",
		role: "judge",
		password: "Judge1234!",
	},
];

export async function runAuthSeed() {
	console.log("👤 Creating auth users...\n");

	for (const userData of AUTH_USERS) {
		try {
			const user = await createAuthUser(userData);
			if (!user) throw new Error("Failed to insert user");
			console.log(
				`  ✅ [${user.role?.padEnd(8)}] ${user.name} <${user.email}>`,
			);
			// biome-ignore lint/suspicious/noExplicitAny: error type is unknown at catch boundary
		} catch (error: any) {
			// Skip if user already exists (unique constraint violation)
			if (
				error?.message?.includes("unique") ||
				error?.code === "23505" ||
				error?.message?.includes("duplicate")
			) {
				console.log(`  ⏭️  Already exists: ${userData.email}`);
			} else {
				console.error(`  ❌ Error creating ${userData.email}:`, error.message);
				throw error;
			}
		}
	}

	console.log(`\n  📊 Total: ${AUTH_USERS.length} users processed`);
}
