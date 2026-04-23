import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@juris-os-/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const inputVariants = cva(
	"flex w-full min-w-0 font-body text-sm outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-on-surface-variant/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"h-14 rounded-lg border-x-0 border-t-0 border-b-2 border-b-transparent bg-surface-container-high px-4 py-4 focus-visible:border-b-primary focus-visible:ring-0 aria-invalid:border-b-destructive aria-invalid:ring-0",
				filled:
					"h-14 border-x-0 border-t-0 border-b-2 border-b-outline-variant/30 bg-surface-container-lowest px-4 py-4 transition-all focus-visible:border-b-primary focus-visible:bg-surface-container-low focus-visible:ring-0",
				search:
					"h-9 rounded-full border-none bg-surface-container-high px-4 py-1.5 focus-visible:ring-2 focus-visible:ring-primary",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Input({
	className,
	type,
	variant,
	...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(inputVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Input };
