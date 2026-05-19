import { Field, FieldError, FieldLabel } from "@juris-os/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@juris-os/ui/components/input-group";
import type * as React from "react";

import { useFieldContext } from "./form-context";

export type FormInputGroupProps = React.ComponentProps<
	typeof InputGroupInput
> & {
	label: string;
	startAdornment?: React.ReactNode;
};

export function FormInputGroup({
	label,
	placeholder,
	autoComplete,
	startAdornment,
	...props
}: FormInputGroupProps) {
	const field = useFieldContext<string>();

	const isInvalid =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	return (
		<Field className={isInvalid ? "text-destructive" : ""}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>

			<InputGroup>
				{startAdornment && (
					<InputGroupAddon align="inline-start">
						{startAdornment}
					</InputGroupAddon>
				)}

				<InputGroupInput
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					aria-invalid={isInvalid}
					aria-describedby={isInvalid ? `${field.name}-error` : undefined}
					placeholder={placeholder}
					autoComplete={autoComplete}
					{...props}
				/>
			</InputGroup>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
