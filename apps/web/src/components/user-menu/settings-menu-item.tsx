"use client";

import { DropdownMenuItem } from "@juris-os/ui/components/dropdown-menu";
import { Settings } from "lucide-react";
import Link from "next/link";

export function SettingsMenuItem() {
	return (
		<DropdownMenuItem
			render={(props) => (
				<Link href={"#settings"} {...props}>
					<Settings />
					Configuración
				</Link>
			)}
		/>
	);
}
