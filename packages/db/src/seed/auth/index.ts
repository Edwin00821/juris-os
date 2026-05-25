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
		const user = await createAuthUser(userData);
		if (user) {
			console.log(
				`  ✅ [${user.role?.padEnd(8)}] ${user.name} <${user.email}>`,
			);
		} else {
			console.log(`  ⏭️  Already exists: ${userData.email}`);
		}
	}

	console.log(`\n  📊 Total: ${AUTH_USERS.length} users processed`);
}
