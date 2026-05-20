"use client";

import { DropdownMenuItem } from "@juris-os/ui/components/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutMenuItem() {
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/sign-in");
				},
			},
		});
	};

	return (
		<DropdownMenuItem variant="destructive" onClick={handleSignOut}>
			<LogOut />
			Cerrar sesión
		</DropdownMenuItem>
	);
}
