import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@juris-os-/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
	"group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap font-bold uppercase tracking-tighter transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none",
	{
		variants: {
			variant: {
				default:
					"rounded-full bg-primary-fixed px-3 py-1 text-on-primary-fixed text-xs",
				secondary:
					"rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container text-xs",
				error:
					"rounded bg-error-container px-2 py-0.5 text-destructive text-xs",
				tag: "rounded bg-surface-container-high px-2 py-1 font-semibold text-on-surface-variant text-xs normal-case tracking-normal",
				optimal:
					"rounded bg-primary-fixed-dim px-2 py-1 font-black text-[10px] text-on-primary-fixed tracking-widest",
				outline:
					"rounded-full border border-outline-variant px-3 py-1 text-on-surface-variant text-xs hover:bg-surface-container",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ variant }), className),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
		},
	});
}

export { Badge, badgeVariants };
