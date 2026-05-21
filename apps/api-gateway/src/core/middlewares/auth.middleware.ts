import { env } from "@juris-os/env/api-gateway";
import type { Context, Next } from "hono";
import { jwk } from "hono/jwk";
import { fail } from "../http/response.helper";

// Extends Hono's context so c.get('user') is typed in every downstream handler.
export type AuthUser = {
	id: string;
	email: string;
	role: "citizen" | "judge" | "admin";
};

declare module "hono" {
	interface ContextVariableMap {
		user: AuthUser;
	}
}

// Verifies the JWT issued by Better Auth's JWT plugin via JWKS.
// Better Auth exposes the public key at /api/auth/jwks — no DB query needed.
//
// Prerequisites in your Next.js auth config:
//   import { jwt } from "better-auth/plugins"
//   export const auth = betterAuth({ plugins: [jwt()] })
//
// The frontend must send the token from the `set-auth-jwt` header
// (returned by authClient.getSession) as: Authorization: Bearer <token>
// Better Auth's JWT plugin signs with RS256 by default.
// If you changed the algorithm in your Better Auth config, update this value.
const verifyJwt = jwk({
	jwks_uri: `${env.CORS_ORIGIN}/api/auth/jwks`,
	alg: ["EdDSA"],
});

export const requireAuth = async (c: Context, next: Next) => {
	// Delegate signature verification to Hono's jwk middleware
	const verifyResult = await verifyJwt(c, async () => {});

	// If jwk returned a response, it means verification failed
	if (verifyResult instanceof Response) {
		return fail(c, "UNAUTHORIZED", "Invalid or missing session.", 401);
	}

	const payload = c.get("jwtPayload") as {
		sub: string;
		email: string;
		role: string;
	};

	if (!payload?.sub) {
		return fail(c, "UNAUTHORIZED", "Invalid token payload.", 401);
	}

	c.set("user", {
		id: payload.sub,
		email: payload.email,
		role: payload.role as AuthUser["role"],
	});

	await next();
};

// Usage: adminRouter.use('/*', requireAuth, requireRole('admin'))
export const requireRole = (...roles: AuthUser["role"][]) => {
	return async (c: Context, next: Next) => {
		const user = c.get("user");

		if (!roles.includes(user.role)) {
			return fail(c, "FORBIDDEN", "Insufficient permissions.", 403);
		}

		await next();
	};
};
