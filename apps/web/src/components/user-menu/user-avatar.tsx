"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@juris-os/ui/components/avatar";
import { cn } from "@juris-os/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { UserCircle } from "lucide-react";
import type * as React from "react";

const avatarVariants = cva(
	"relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-trasnparent",
	{
		variants: {
			size: {
				sm: "size-8 text-sm",
				md: "size-10 text-md",
				lg: "size-12 text-lg",
			},
			rounded: {
				full: "rounded-full",
				lg: "rounded-lg",
			},
		},
		defaultVariants: {
			size: "md",
			rounded: "full",
		},
	},
);

export interface UserAvatarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof avatarVariants> {
	name?: string | null;
	image?: string | null;
}

export function UserAvatar({
	name,
	image,
	size,
	rounded,
	className,
	...props
}: UserAvatarProps) {
	return (
		<div className={cn("flex", className)} {...props}>
			<Avatar className={cn(avatarVariants({ size, rounded }))}>
				<AvatarImage src={image ?? undefined} alt={name ?? "user avatar"} />
				<AvatarFallback
					className={cn(
						"flex items-center justify-center bg-transparent font-medium text-blue-900",
						avatarVariants({ size, rounded }),
					)}
				>
					<UserCircle className="size-5" />
				</AvatarFallback>
			</Avatar>
		</div>
	);
}
