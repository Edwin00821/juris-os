"use client";

import { Button } from "@juris-os/ui/components/button";
import { Card } from "@juris-os/ui/components/card";

import { ArrowLeft, FileText, Send, UserX } from "lucide-react";
import Link from "next/link";

import { FileUploadZone } from "@/modules/documents/components/file-upload-zone";
import { useSubmitLawsuit } from "../hooks/use-submit-lawsuit";

const CATEGORY_OPTIONS = [
	{ label: "Laboral", value: "labor" },
	{ label: "Familiar", value: "family" },
	{ label: "Penal", value: "criminal" },
];

export function ManualLawsuitForm() {
	const { form, isSubmitting, error } = useSubmitLawsuit();

	return (
		<form.AppForm>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
				className="flex flex-col gap-8"
			>
				{error && (
					<div className="rounded-lg bg-error-container p-4 font-medium text-error-container-foreground text-sm">
						{error}
					</div>
				)}

				<Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-none">
					<div className="mb-8 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/30 bg-primary-fixed">
							<FileText className="size-6 text-primary" />
						</div>
						<div>
							<h2 className="font-bold font-headline text-primary text-xl">
								Datos del Caso
							</h2>
							<p className="text-on-surface-variant text-sm">
								Proporcione la información principal de su demanda.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="md:col-span-2">
							<form.AppField name="title">
								{(field) => (
									<field.InputGroup
										label="Título del Caso *"
										placeholder="Ej: Disputa contractual con empresa de logística"
										type="text"
									/>
								)}
							</form.AppField>
						</div>

						<div className="md:col-span-2">
							<form.AppField name="description">
								{(field) => (
									<field.Textarea
										label="Descripción de los Hechos *"
										placeholder="Describa detalladamente los hechos que motivan su demanda..."
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField name="category">
							{(field) => (
								<field.Select label="Categoría *" options={CATEGORY_OPTIONS} />
							)}
						</form.AppField>

						<form.AppField name="incidentDate">
							{(field) => (
								<field.InputGroup label="Fecha de los Hechos *" type="date" />
							)}
						</form.AppField>
					</div>
				</Card>

				<FileUploadZone />

				<Card className="rounded-xl border border-outline-variant bg-surface-container-high p-8 shadow-none">
					<div className="mb-8 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-primary">
							<UserX className="size-6 text-primary" />
						</div>
						<div>
							<h3 className="font-bold font-headline text-primary text-xl">
								Información de la Contraparte
							</h3>
							<p className="text-on-surface-variant text-sm">
								Proporcione los detalles de la parte contra la que está
								presentando la demanda.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						<form.AppField name="counterpartyName">
							{(field) => (
								<field.InputGroup
									label="Nombre Legal Completo"
									placeholder="Nombre de la Persona o Corporación"
									type="text"
								/>
							)}
						</form.AppField>

						<form.AppField name="counterpartyAddress">
							{(field) => (
								<field.InputGroup
									label="Dirección Registrada"
									placeholder="Av. Justicia 123, Piso 4"
									type="text"
								/>
							)}
						</form.AppField>

						<form.AppField name="counterpartyId">
							{(field) => (
								<field.InputGroup
									label="ID de la Entidad (Opcional)"
									placeholder="# de Registro Comercial"
									type="text"
								/>
							)}
						</form.AppField>
					</div>
				</Card>

				<div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<Link
						href="/citizen/cases/new"
						className="flex items-center gap-2 font-semibold text-on-surface-variant text-sm transition-colors hover:text-primary"
					>
						<ArrowLeft className="size-4" /> Volver a opciones de registro
					</Link>

					<div className="flex w-full gap-3 sm:w-auto">
						<Button
							type="button"
							variant="outline"
							className="h-12 w-full border-none bg-surface-container-high px-6 font-bold text-on-surface-variant transition-colors hover:bg-surface-dim sm:w-auto"
						>
							Guardar Borrador
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex h-12 w-full items-center gap-2 bg-primary px-8 font-bold text-white shadow-md transition-colors hover:bg-primary/90 sm:w-auto"
						>
							<Send className="size-4" />
							{isSubmitting ? "Enviando..." : "Enviar Demanda"}
						</Button>
					</div>
				</div>
			</form>
		</form.AppForm>
	);
}
