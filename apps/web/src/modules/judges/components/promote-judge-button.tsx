"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { usePromoteUser } from "../hooks/use-promote-user";

interface PromoteJudgeButtonProps {
	userId: string;
	isVerified: boolean;
}

export function PromoteJudgeButton({
	userId,
	isVerified,
}: PromoteJudgeButtonProps) {
	const { mutate: promoteUser, isPending } = usePromoteUser();

	if (!isVerified) {
		return (
			<button
				disabled
				type="button"
				className="ml-auto flex cursor-not-allowed items-center gap-1 font-bold text-slate-400 text-xs"
			>
				<ArrowUpFromLine className="h-4 w-4" />
				Elevar a Juez
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={() => promoteUser(userId)}
			disabled={isPending}
			className={cn(
				"ml-auto flex items-center gap-1 font-bold text-xs transition-all",
				isPending
					? "cursor-wait text-secondary opacity-70"
					: "text-primary hover:underline",
			)}
		>
			<span className={cn("text-sm", isPending && "animate-spin")}>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<ArrowUpFromLine className="h-4 w-4" />
				)}
			</span>
			{isPending ? "Elevando..." : "Elevar a Juez"}
		</button>
	);
}
