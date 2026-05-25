"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

export function AssignedCasesSearch() {
	const [searchQuery, setSearchQuery] = useQueryState("q", {
		defaultValue: "",
		shallow: false,
	});

	return (
		<div className="relative">
			<input
				className="w-72 rounded-full border-none bg-surface-container-high py-1.5 pr-4 pl-10 text-on-surface text-sm transition-all focus:ring-2 focus:ring-primary"
				placeholder="Buscar por juez o caso..."
				type="text"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<Search className="absolute top-2.5 left-3 h-4 w-4 text-on-surface-variant" />
		</div>
	);
}
