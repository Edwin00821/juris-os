import { Field, FieldError, FieldLabel } from "@juris-os/ui/components/field";
import { Textarea } from "@juris-os/ui/components/textarea";
import type * as React from "react";
import { useFieldContext } from "./form-context";

export type FormTextareaProps = React.ComponentProps<typeof Textarea> & {
	label: string;
};

export function FormTextarea({
	label,
	className,
	...props
}: FormTextareaProps) {
	const field = useFieldContext<string>();
	const isInvalid =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	return (
		<Field
			className={
				isInvalid
					? "flex flex-col gap-1.5 text-destructive"
					: "flex flex-col gap-1.5"
			}
		>
			<FieldLabel
				className="px-1 font-bold font-label text-xs uppercase tracking-widest"
				htmlFor={field.name}
			>
				{label}
			</FieldLabel>

			<Textarea
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={isInvalid}
				className={`min-h-30 w-full resize-y rounded-t-md border-transparent border-b-2 bg-surface-container-highest p-3 transition-colors focus:border-primary focus:ring-0 ${className || ""}`}
				{...props}
			/>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
