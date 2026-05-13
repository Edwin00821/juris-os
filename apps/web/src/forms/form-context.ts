import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormPassword } from "./form-password";
import { SubscribeButton } from "./form-subscribe-button";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		Input: FormInput,
		Password: FormPassword,
		Checkbox: FormCheckbox,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
