import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@juris-os/ui/components/dropdown-menu";

import type { User } from "@/types/user.type";

import { SettingsMenuItem } from "./settings-menu-item";
import { SignOutMenuItem } from "./sign-out-menu-item";
import { UserAvatar } from "./user-avatar";
import { UserInfoDisplay } from "./user-info-display";

export interface UserMenuNavbarProps {
	user?: User;
}

export function UserMenuNavbar({ user }: UserMenuNavbarProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={(props) => (
					<button
						type="button"
						className="cursor-pointer rounded-full bg-transparent p-0.5 text-blue-900 outline-hidden transition-colors hover:bg-slate-100"
						{...props}
					>
						<UserAvatar name={user?.name} image={user?.image} />
					</button>
				)}
			/>

			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border border-slate-200 p-1 shadow-sm"
				side="bottom"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex gap-2 px-2 py-3 font-normal">
						<UserInfoDisplay user={user} />
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator className="bg-slate-100" />

				{user && (
					<DropdownMenuGroup>
						<SettingsMenuItem />

						<DropdownMenuSeparator className="bg-slate-100" />

						<SignOutMenuItem />
					</DropdownMenuGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
