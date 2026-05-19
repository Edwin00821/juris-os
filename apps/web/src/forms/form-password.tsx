import { Field, FieldError, FieldLabel } from "@juris-os/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@juris-os/ui/components/input-group";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { HTMLInputAutoCompleteAttribute } from "react";
import { useState } from "react";

import { useFieldContext } from "./form-context";

export type FormPasswordProps = {
	label: string;
	placeholder?: string;
	autoComplete?: HTMLInputAutoCompleteAttribute;
};

export function FormPassword({
	label,
	placeholder = "••••••••••••",
	autoComplete = "current-password",
}: FormPasswordProps) {
	const field = useFieldContext<string>();
	const [showPassword, setShowPassword] = useState(false);

	const isInvalid =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<Field className={isInvalid ? "text-destructive" : ""}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<Lock className="size-5" />
				</InputGroupAddon>

				<InputGroupInput
					id={field.name}
					name={field.name}
					type={showPassword ? "text" : "password"}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					aria-invalid={isInvalid}
					placeholder={placeholder}
					autoComplete={autoComplete}
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="button"
						onClick={togglePasswordVisibility}
						aria-label={
							showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
						}
					>
						{showPassword ? (
							<EyeOff className="size-5" />
						) : (
							<Eye className="size-5" />
						)}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
