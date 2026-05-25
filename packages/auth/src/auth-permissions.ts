import { createAccessControl } from "better-auth/plugins/access";

const statement = {
	user: [
		"create",
		"list",
		"set-role",
		"ban",
		"impersonate",
		"delete",
		"set-password",
		"get",
		"update",
	],
	session: ["list", "revoke", "delete"],
	case: ["create", "read", "update", "delete", "assign"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
	citizen: ac.newRole({
		user: ["get", "update"],
		session: ["list", "revoke", "delete"],
		case: ["create", "read"],
	}),

	judge: ac.newRole({
		user: ["list", "get", "set-role"],
		session: ["list", "revoke", "delete"],
		case: ["read", "update", "assign"],
	}),

	admin: ac.newRole({
		user: [
			"create",
			"list",
			"set-role",
			"ban",
			"impersonate",
			"delete",
			"set-password",
			"get",
			"update",
		],
		session: ["list", "revoke", "delete"],
		case: ["create", "read", "update", "delete", "assign"],
	}),
};
