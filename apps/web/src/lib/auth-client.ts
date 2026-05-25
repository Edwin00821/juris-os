import { ac, roles } from "@juris-os/auth/auth-permissions";
import { env } from "@juris-os/env/web";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	plugins: [
		adminClient({
			ac,
			roles,
		}),
	],
});
