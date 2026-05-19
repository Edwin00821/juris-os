import { db } from "@juris-os/db/web";
import { hashPassword } from "@juris-os/utils/auth";
import { nanoid } from "nanoid";
import * as authSchema from "../../schema/auth.schema";

export async function createAuthUser(data: {
	name: string;
	email: string;
	role: string;
	password?: string;
}) {
	const userId = nanoid();
	const hashedPassword = await hashPassword(data.password ?? "12345678");

	const [user] = await db
		.insert(authSchema.user)
		.values({
			id: userId,
			name: data.name,
			email: data.email,
			emailVerified: true,
			role: data.role,
			image: undefined,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	await db.insert(authSchema.account).values({
		id: nanoid(),
		accountId: userId,
		providerId: "credential",
		userId: userId,
		password: hashedPassword,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	return user;
}
