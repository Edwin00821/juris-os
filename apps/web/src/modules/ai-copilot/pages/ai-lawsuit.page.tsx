"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@juris-os/ui/components/breadcrumb";
import { Button } from "@juris-os/ui/components/button";
import { Card } from "@juris-os/ui/components/card";
import { Input } from "@juris-os/ui/components/input";
import { Label } from "@juris-os/ui/components/label";

import { ArrowLeft, Loader2, Save, Send, Sparkles, UserX } from "lucide-react";

import Link from "next/link";
import * as React from "react";

import { FileUploadZone } from "@/modules/documents/components/file-upload-zone";
import { AIChatInterface } from "../chat/ai-chat-interface";
import { LiveDocumentPreview } from "../components/live-document-preview";
import { useAICopilot } from "../hooks/use-ai-copilot";

export function AILawsuitPage() {
	const copilot = useAICopilot();

	const [counterparty, setCounterparty] = React.useState({
		name: "",
		address: "",
		id: "",
	});
	const [draftSaved, setDraftSaved] = React.useState(false);

	const { setCounterparty: syncCounterparty } = copilot;

	// Keep the copilot hook in sync so document generation and draft saving
	// use the latest counterparty data.
	React.useEffect(() => {
		syncCounterparty(counterparty);
	}, [counterparty, syncCounterparty]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		copilot.submitCase(counterparty);
	};

	const handleSaveDraft = () => {
		copilot.saveDraft();
		setDraftSaved(true);
		setTimeout(() => setDraftSaved(false), 2500);
	};

	return (
		<main className="mx-auto flex w-full max-w-350 grow flex-col gap-6 px-4 py-8 text-foreground md:px-8">
			<Breadcrumb>
				<BreadcrumbList className="gap-2 text-on-surface-variant text-sm">
					<BreadcrumbItem>
						<BreadcrumbLink
							render={
								<Link
									href="/citizen"
									className="flex items-center gap-1 font-semibold transition-colors hover:text-primary"
								>
									<ArrowLeft className="size-4" /> Panel
								</Link>
							}
						/>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="[&>svg]:size-4" />
					<BreadcrumbItem>
						<BreadcrumbLink
							render={
								<Link
									href="/citizen/cases/new"
									className="font-semibold transition-colors hover:text-primary"
								>
									Registrar Caso
								</Link>
							}
						/>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="[&>svg]:size-4" />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-semibold text-primary">
							Demanda con IA
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<section>
				<div className="mb-2 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container shadow-sm">
						<Sparkles className="size-5 text-primary-fixed-dim" />
					</div>
					<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
						Demanda Generada con IA
					</h1>
				</div>
				<p className="max-w-3xl text-on-surface-variant text-sm leading-relaxed">
					Converse con nuestro asistente de IA para construir su demanda. El
					documento se actualizará en tiempo real conforme avance la
					conversación.
				</p>
			</section>

			<div className="grid min-h-180 grow grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-4">
					<div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="font-semibold text-on-surface-variant text-sm">
								Progreso de recopilación
							</span>
							<span className="font-bold text-primary text-sm">
								{copilot.progress}%
							</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
							<div
								className="h-full bg-primary transition-all duration-300"
								style={{ width: `${copilot.progress}%` }}
							/>
						</div>
						<p className="mt-3 text-on-surface-variant text-xs leading-relaxed">
							El asistente está recopilando información sobre su caso. Responda
							las preguntas para completar la demanda.
						</p>
					</div>
					<AIChatInterface copilot={copilot} />
				</div>
				<LiveDocumentPreview copilot={copilot} />
			</div>

			<Card className="rounded-xl border-outline-variant bg-surface-container-high p-8 shadow-sm">
				<div className="mb-8 flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-primary shadow-sm">
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
					<div className="flex flex-col gap-2">
						<Label
							htmlFor="cpNombre"
							className="px-1 font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest"
						>
							Nombre Legal Completo
						</Label>
						<Input
							id="cpNombre"
							value={counterparty.name}
							onChange={(e) =>
								setCounterparty({ ...counterparty, name: e.target.value })
							}
							className="h-11 rounded-t-md rounded-b-none border-transparent border-b-2 border-none bg-surface-container-highest p-3 text-foreground shadow-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
							placeholder="Nombre de la Persona o Corporación"
							type="text"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label
							htmlFor="cpDireccion"
							className="px-1 font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest"
						>
							Dirección Registrada
						</Label>
						<Input
							id="cpDireccion"
							value={counterparty.address}
							onChange={(e) =>
								setCounterparty({ ...counterparty, address: e.target.value })
							}
							className="h-11 rounded-t-md rounded-b-none border-transparent border-b-2 border-none bg-surface-container-highest p-3 text-foreground shadow-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
							placeholder="Av. Justicia 123, Piso 4"
							type="text"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label
							htmlFor="cpId"
							className="px-1 font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest"
						>
							ID de la Entidad (Opcional)
						</Label>
						<Input
							id="cpId"
							value={counterparty.id}
							onChange={(e) =>
								setCounterparty({ ...counterparty, id: e.target.value })
							}
							className="h-11 rounded-t-md rounded-b-none border-transparent border-b-2 border-none bg-surface-container-highest p-3 text-foreground shadow-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
							placeholder="# de Registro Comercial"
							type="text"
						/>
					</div>
				</div>
			</Card>

			<Card className="rounded-xl border-outline-variant bg-surface-container-high p-8 shadow-sm">
				<h3 className="mb-4 font-bold font-headline text-primary text-xl">
					Documentos de Soporte (Opcional)
				</h3>
				<p className="mb-6 text-on-surface-variant text-sm">
					Adjunte contratos, recibos, fotografías u otros documentos que
					respalden su demanda.
				</p>
				<FileUploadZone onFilesChange={copilot.setPendingFiles} />
			</Card>

			{copilot.submitError && (
				<p className="rounded-lg bg-error-container px-4 py-3 text-center text-on-error-container text-sm">
					{copilot.submitError}
				</p>
			)}

			<Card className="rounded-xl border-outline-variant bg-surface-container-high p-6 shadow-sm">
				<div className="mb-4 flex items-start gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-primary">
						<Send className="size-4" />
					</div>
					<div>
						<h3 className="font-bold font-headline text-lg text-primary">
							Revisar y Enviar Demanda
						</h3>
						<p className="text-on-surface-variant text-sm">
							Una vez que haya completado la conversación con el asistente,
							proporcione los datos de la contraparte y envíe su demanda.
						</p>
					</div>
				</div>

				<div className="mb-6 rounded-lg bg-surface-container-highest p-4">
					<p className="mb-3 font-semibold text-on-surface-variant text-sm">
						Estado de la demanda:
					</p>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							{copilot.caseData.title ? (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">
									✓
								</span>
							) : (
								<span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-outline" />
							)}
							<span
								className={
									copilot.caseData.title
										? "text-on-surface"
										: "text-on-surface-variant"
								}
							>
								Título de la demanda
							</span>
						</div>
						<div className="flex items-center gap-2">
							{copilot.caseData.description ? (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">
									✓
								</span>
							) : (
								<span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-outline" />
							)}
							<span
								className={
									copilot.caseData.description
										? "text-on-surface"
										: "text-on-surface-variant"
								}
							>
								Descripción de los hechos
							</span>
						</div>
						<div className="flex items-center gap-2">
							{copilot.caseData.claims ? (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">
									✓
								</span>
							) : (
								<span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-outline" />
							)}
							<span
								className={
									copilot.caseData.claims
										? "text-on-surface"
										: "text-on-surface-variant"
								}
							>
								Peticiones/Reclamaciones
							</span>
						</div>
					</div>
				</div>
			</Card>

			<form onSubmit={handleSubmit}>
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<Link
						href="/citizen/cases/new"
						className="flex items-center gap-2 font-semibold text-on-surface-variant text-sm transition-colors hover:text-primary"
					>
						<ArrowLeft className="size-4" /> Volver a opciones de registro
					</Link>
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleSaveDraft}
							disabled={!copilot.caseData.title}
							className="flex h-12 items-center gap-2 rounded-lg px-6 py-3 font-bold text-sm"
							title="Guardar el avance como borrador"
						>
							<Save className="size-4" />
							{draftSaved ? "Borrador guardado" : "Guardar borrador"}
						</Button>
						<Button
							type="submit"
							disabled={
								copilot.isSubmitting ||
								!counterparty.name ||
								!copilot.caseData.title
							}
							className="flex h-12 items-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-sm text-white shadow-md transition-colors hover:bg-primary/90 disabled:opacity-60"
							title={
								!counterparty.name
									? "Ingrese el nombre de la contraparte"
									: !copilot.caseData.title
										? "Complete la conversación para generar el título"
										: "Enviar demanda"
							}
						>
							{copilot.isSubmitting ? (
								<>
									<Loader2 className="size-4 animate-spin" /> Enviando...
								</>
							) : (
								<>
									<Send className="size-4" /> Enviar Demanda
								</>
							)}
						</Button>
					</div>
				</div>
			</form>
		</main>
	);
}
