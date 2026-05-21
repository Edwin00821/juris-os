import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useAppForm } from "@/forms/form-context";

const manualLawsuitSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	category: z.string().min(1, "Seleccione una categoría"),
	incidentDate: z.string().min(1, "La fecha es requerida"),

	counterpartyName: z.string(),
	counterpartyAddress: z.string(),
	counterpartyId: z.string(),
});

export function useSubmitLawsuit() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: {
			title: "",
			description: "",
			category: "",
			incidentDate: "",

			counterpartyName: "",
			counterpartyAddress: "",
			counterpartyId: "",
		},
		validators: {
			onChange: manualLawsuitSchema,
			onSubmit: manualLawsuitSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			setError(null);

			try {
				await new Promise((resolve) => setTimeout(resolve, 1500));

				console.log("Payload enviado:", value);

				router.push("/citizen/cases/new");

				router.refresh();
			} catch (_e) {
				setError(
					"Ocurrió un error al registrar la demanda. Intente nuevamente.",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return { form, isSubmitting, error };
}
