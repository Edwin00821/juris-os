import { UserCircle } from "lucide-react";
import { Fragment } from "react";

import type { User } from "@/types/user.type";

import { UserAvatar } from "./user-avatar";

interface UserInfoDisplayProps {
	user?: User;
	avatarSize?: "sm" | "md" | "lg";
}

interface UserInfoProps {
	title: string;
	subtitle: string;
}

function UserInfo({ title, subtitle }: UserInfoProps) {
	return (
		<div className="grid flex-1 text-left text-sm leading-tight">
			<span className="truncate font-bold text-blue-950">{title}</span>
			<span className="truncate text-slate-500 text-xs">{subtitle}</span>
		</div>
	);
}

function GuestAvatar() {
	return (
		<div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
			<UserCircle className="size-5 text-slate-500" />
		</div>
	);
}

export function UserInfoDisplay({
	user,
	avatarSize = "md",
}: UserInfoDisplayProps) {
	const avatar = user ? (
		<UserAvatar name={user.name} image={user.image} size={avatarSize} />
	) : (
		<GuestAvatar />
	);

	const info = user ? (
		<UserInfo title={user.name} subtitle={user.email} />
	) : (
		<UserInfo title="Invitado" subtitle="No has iniciado sesión" />
	);

	return (
		<Fragment>
			{avatar}
			{info}
		</Fragment>
	);
}
