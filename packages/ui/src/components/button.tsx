import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@juris-os-/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-bold font-headline text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-br from-primary-container to-primary text-primary-foreground shadow-lg hover:opacity-90 hover:shadow-xl active:scale-[0.98]",
				outline:
					"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				ghost:
					"text-muted-foreground hover:bg-muted hover:text-foreground hover:text-primary aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
				destructive:
					"bg-destructive/10 text-destructive-foreground hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
				link: "text-primary underline-offset-4 hover:underline",
				nav: "rounded-none border-transparent border-b-2 bg-transparent pb-2 text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary",
			},
			size: {
				default: "h-14 px-6 py-4",
				xs: "h-8 px-3 text-xs",
				sm: "h-10 px-4",
				lg: "h-16 px-8 text-base",
				icon: "size-10 rounded-full",
				"icon-xs": "size-8 rounded-full",
				"icon-sm": "size-10 rounded-full",
				"icon-lg": "size-12 rounded-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
