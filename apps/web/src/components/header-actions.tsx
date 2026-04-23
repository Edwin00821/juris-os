import { cn } from "@juris-os-/ui/lib/utils";
import { Bell, User } from "lucide-react";

export function HeaderActionGroup({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-1", className)}>{children}</div>
	);
}

interface NotificationActionProps {
	hasUnread?: boolean;
	unreadCount?: number;
}

export function NotificationAction({
	hasUnread,
	unreadCount,
}: NotificationActionProps) {
	const showBadge = unreadCount !== undefined && unreadCount > 0;
	const showDot = !showBadge;

	return (
		<button
			type="button"
			className="relative rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
		>
			<Bell className="size-5" />

			{showDot && (
				<span
					className={[
						"absolute top-2 right-2.5 size-1.75 rounded-full border-2 border-white dark:border-zinc-900",
						hasUnread ? "bg-red-500" : "bg-zinc-400 dark:bg-zinc-600",
					].join(" ")}
				/>
			)}

			{showBadge && (
				<span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 font-semibold text-[9px] text-white dark:border-zinc-900">
					{unreadCount > 99 ? "99+" : unreadCount}
				</span>
			)}
		</button>
	);
}

export function UserAccountAction() {
	return (
		<button
			type="button"
			className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
		>
			<User className="size-5" />
		</button>
	);
}
