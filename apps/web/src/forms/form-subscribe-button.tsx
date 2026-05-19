import { Button } from "@juris-os/ui/components/button";

import { Loader2 } from "lucide-react";

import type { ComponentProps } from "react";

import { useFormContext } from "./form-context";

export function SubscribeButton({
	children,
	...props
}: ComponentProps<typeof Button>) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					{...props}
					type="submit"
					disabled={isSubmitting || props.disabled}
				>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}
