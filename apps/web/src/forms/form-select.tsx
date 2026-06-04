import { Field, FieldError, FieldLabel } from "@juris-os/ui/components/field";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@juris-os/ui/components/select";
import type * as React from "react";
import { useFieldContext } from "./form-context";

export type FormSelectProps = Omit<
	React.ComponentProps<typeof Select>,
	"value" | "onValueChange"
> & {
	label: string;
	options: { label: string; value: string }[];
	className?: string;
	placeholder?: string;
};

export function FormSelect({
	label,
	options,
	className,
	placeholder = "Seleccione una opción",
	...props
}: FormSelectProps) {
	const field = useFieldContext<string>();
	const isInvalid =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;
	const selectedLabel = options.find(
		(opt) => opt.value === field.state.value,
	)?.label;

	return (
		<Field
			className={
				isInvalid
					? "flex flex-col gap-3 text-destructive"
					: "flex flex-col gap-3"
			}
		>
			<FieldLabel
				className="px-1 font-bold font-label text-xs uppercase tracking-widest"
				htmlFor={field.name}
			>
				{label}
			</FieldLabel>

			<Select
				name={field.name}
				value={field.state.value}
				onValueChange={(val) => field.handleChange(val as string)}
				{...props}
			>
				<SelectTrigger
					id={field.name}
					onBlur={field.handleBlur}
					aria-invalid={isInvalid}
					size="lg"
					className={`rounded-md border-transparent bg-surface-container-highest p-4 transition-colors focus:border-primary focus:ring-0 ${className || ""}`}
				>
					<SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
				</SelectTrigger>

				<SelectContent>
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
