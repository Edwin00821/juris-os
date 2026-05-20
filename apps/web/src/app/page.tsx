import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/types/user.type";

export default async function Home() {
	const session = await getSession();

	if (!session) redirect("/sign-in");

	const role = session.user.role as UserRole;

	if (role === "citizen") redirect("/citizen");
	if (role === "judge") redirect("/judge");
	if (role === "admin") redirect("/admin");

	return null;
}
