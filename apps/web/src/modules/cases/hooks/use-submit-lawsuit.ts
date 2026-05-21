import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useAppForm } from "@/forms/form-context";
import { apiClient } from "@/lib/api-client";

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
	const queryClient = useQueryClient();
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
				await apiClient("/cases", {
					method: "POST",
					body: JSON.stringify(value),
				});

				await queryClient.invalidateQueries({
					queryKey: ["active-cases"],
				});

				router.push("/citizen");
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
