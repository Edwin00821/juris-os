import { Input } from "@juris-os-/ui/components/input";
import { cn } from "@juris-os-/ui/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
	placeholder?: string;
	className?: string;
}

export function SearchInput({
	placeholder = "Search...",
	className,
}: SearchInputProps) {
	return (
		<div className={cn("group relative w-full max-w-64", className)}>
			<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant/50 transition-colors group-focus-within:text-primary" />
			<Input
				variant="search"
				placeholder={placeholder}
				className="h-9 border-none bg-surface-container-high pl-10 focus-visible:ring-1 focus-visible:ring-primary"
			/>
		</div>
	);
}
