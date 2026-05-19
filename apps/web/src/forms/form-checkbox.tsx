import { Checkbox } from "@juris-os/ui/components/checkbox";
import { Field, FieldError, FieldLabel } from "@juris-os/ui/components/field";

import { useFieldContext } from "./form-context";

export type FormCheckboxProps = {
	label: string;
};

export function FormCheckbox({ label }: FormCheckboxProps) {
	const field = useFieldContext<boolean>();
	const isInvalid =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	return (
		<Field className="flex flex-row items-start space-x-3 space-y-0">
			<Checkbox
				id={field.name}
				checked={field.state.value}
				onCheckedChange={(checked) => field.handleChange(checked === true)}
			/>
			<div className="space-y-1 leading-none">
				<FieldLabel htmlFor={field.name} className="cursor-pointer font-normal">
					{label}
				</FieldLabel>
				{isInvalid && <FieldError errors={field.state.meta.errors} />}
			</div>
		</Field>
	);
}
