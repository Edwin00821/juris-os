import * as schema from "@juris-os/db/schema/auth.schema";
import { db } from "@juris-os/db/web";
import { env } from "@juris-os/env/web";
import { hashPassword, verifyPassword } from "@juris-os/utils/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, jwt, openAPI } from "better-auth/plugins";

const devPlugins = env.NODE_ENV === "development" ? [openAPI()] : [];

export function createAuth() {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema: schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],

		emailAndPassword: {
			enabled: true,
			password: {
				hash: hashPassword,
				verify: verifyPassword,
			},
		},

		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [admin(), jwt(), ...devPlugins],
	});
}

export const auth = createAuth();
