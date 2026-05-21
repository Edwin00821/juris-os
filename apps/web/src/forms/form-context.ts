import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormInputGroup } from "./form-input-group";
import { FormPassword } from "./form-password";
import { FormSelect } from "./form-select";
import { SubscribeButton } from "./form-subscribe-button";
import { FormTextarea } from "./form-textarea";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		Input: FormInput,
		InputGroup: FormInputGroup,
		Textarea: FormTextarea,
		Select: FormSelect,
		Password: FormPassword,
		Checkbox: FormCheckbox,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
