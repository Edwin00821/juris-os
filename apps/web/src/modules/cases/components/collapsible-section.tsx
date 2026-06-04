"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

export function CollapsibleSection({
	title,
	children,
	defaultOpen = true,
}: CollapsibleSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="rounded-md bg-surface-container-lowest p-6">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between gap-2 transition-opacity hover:opacity-80"
			>
				<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
					{title}
				</p>
				<ChevronDown
					className={cn(
						"size-4 text-on-surface-variant transition-transform",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{isOpen && <div className="mt-4">{children}</div>}
		</div>
	);
}
