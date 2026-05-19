import type { Route } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/types/user.type";

/**
 * Configuration options for authentication guards
 *
 * @property requiredRoles - Array of roles that have access. If empty/undefined, any authenticated user can access
 * @property requireAuth - Whether authentication is required (default: true)
 * @property requireGuest - Whether only unauthenticated users can access (default: false)
 * @property onFail - Action to take when authorization fails: "notFound" returns 404, "redirect" redirects to specified route
 * @property redirectTo - Custom redirect path when authorization fails (defaults to "/sign-in")
 */
type GuardConfig = {
	requiredRoles?: UserRole[];
	requireAuth?: boolean;
	requireGuest?: boolean;
	onFail?: "notFound" | "redirect";
	redirectTo?: Route;
};

/**
 * Creates a cached authentication guard with customizable authorization logic
 *
 * Guards can enforce:
 * - Authentication requirement
 * - Guest-only access
 * - Role-based access control
 *
 * @param config - Guard configuration options
 * @returns Object containing session, user, and authorization status
 *
 * @example
 * // In a server component
 * const { user } = await createAuthGuard({ requiredRoles: ["admin"] });
 */
export const createAuthGuard = cache(async (config: GuardConfig = {}) => {
	const {
		requiredRoles,
		requireAuth = true,
		requireGuest = false,
		onFail = "redirect",
		redirectTo,
	} = config;

	const data = await getSession();

	const session = data?.session;
	const user = data?.user;

	// Guest-only routes: redirect authenticated users
	if (requireGuest && session) redirect("/");

	// Protected routes: handle unauthenticated users
	if (requireAuth && !requireGuest && !session) {
		if (onFail === "redirect") redirect(redirectTo ?? "/sign-in");

		notFound();
	}

	// Role-based access control
	if (user && requiredRoles && requiredRoles.length > 0 && session) {
		const userRole = user.role as UserRole;
		const hasRequiredRole = requiredRoles.includes(userRole);

		if (!hasRequiredRole) {
			notFound();
		}
	}

	// biome-ignore lint/style/noNonNullAssertion: <>
	return { session: session!, user: user!, isAuthorized: true };
});

// ============================================================================
// Convenience Guards - Common authentication patterns
// ============================================================================

/**
 * Standard authentication guard - requires any authenticated user
 * Redirects to sign-in if not authenticated
 */
export const guardAuth = () => createAuthGuard({ requireAuth: true });

/**
 * Guest-only guard - requires unauthenticated user
 * Redirects to home if already authenticated (useful for login/register pages)
 */
export const guardGuest = () =>
	createAuthGuard({ requireGuest: true, requireAuth: false });

/**
 * Admin-only guard - requires authenticated user with "admin" role
 * Returns 404 if user lacks admin privileges
 */
export const guardAdmin = () => createAuthGuard({ requiredRoles: ["admin"] });

/**
 * Citizen-only guard - requires authenticated user with "citizen" role
 * Returns 404 if user lacks citizen privileges
 */
export const guardCitizen = () =>
	createAuthGuard({ requiredRoles: ["citizen"], redirectTo: "/" });

/**
 * Judge-only guard - requires authenticated user with "judge" role
 * Returns 404 if user lacks judge privileges
 */
export const guardJudge = () =>
	createAuthGuard({ requiredRoles: ["judge"], redirectTo: "/" });
