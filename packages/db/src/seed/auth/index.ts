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
		specialty: "criminal" as const,
	},
	{
		name: "Hon. Elena Jacobs",
		email: "elena.jacobs@juris-os.com",
		role: "judge",
		password: "Judge1234!",
		specialty: "labor" as const,
	},
	{
		name: "Hon. Marcus Wright",
		email: "marcus.wright@juris-os.com",
		role: "judge",
		password: "Judge1234!",
		specialty: "criminal" as const,
	},
	{
		name: "Hon. Sophia Chen",
		email: "sophia.chen@juris-os.com",
		role: "judge",
		password: "Judge1234!",
		specialty: "family" as const,
	},
	{
		name: "Hon. David Miller",
		email: "david.miller@juris-os.com",
		role: "judge",
		password: "Judge1234!",
		specialty: "labor" as const,
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
