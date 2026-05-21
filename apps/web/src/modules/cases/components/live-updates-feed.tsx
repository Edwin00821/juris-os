"use client";

import { BellRing, Gavel, RefreshCw } from "lucide-react";
import { type UpdateType, useLiveUpdates } from "../hooks/use-live-updates";

const ICONS_MAP: Record<UpdateType, React.ReactNode> = {
	HEARING: <RefreshCw className="size-4" />,
	SIGNATURE: <Gavel className="size-4" />,
	SYSTEM: <BellRing className="size-4" />,
};

const STYLES_MAP: Record<UpdateType, string> = {
	HEARING: "bg-secondary-container text-on-secondary-container",
	SIGNATURE: "bg-primary-fixed text-on-primary-fixed",
	SYSTEM: "bg-tertiary-container text-on-tertiary-container",
};

export function LiveUpdatesFeed() {
	const { data: updates, isLoading } = useLiveUpdates();

	return (
		<div className="rounded-xl bg-surface-container p-6">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-bold font-headline text-secondary-foreground text-xs uppercase tracking-widest">
					Actualizaciones en Vivo
				</h3>
				{!isLoading && updates && updates.length > 0 && (
					<span className="rounded-full bg-primary-fixed px-2 py-0.5 font-bold text-[10px] text-on-primary-fixed">
						{updates.length} NUEVAS
					</span>
				)}
			</div>

			<div className="space-y-4">
				{!isLoading &&
					updates?.map((update) => (
						<div key={update.id} className="flex items-start gap-3">
							<div className={`${STYLES_MAP[update.type]} rounded-lg p-1.5`}>
								{ICONS_MAP[update.type]}
							</div>
							<div>
								<p className="font-semibold text-foreground text-sm">
									{update.title}
								</p>
								<p className="mt-0.5 text-on-surface-variant text-xs">
									{update.description}
								</p>
								<p className="mt-1 text-[10px] text-outline">
									{update.timestamp}
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
