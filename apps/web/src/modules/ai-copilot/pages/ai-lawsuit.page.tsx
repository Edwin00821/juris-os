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

import { ArrowLeft, Save, Send, Sparkles, UserX } from "lucide-react";

import Link from "next/link";
import * as React from "react";

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

	const handleSaveCounterparty = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(
			"Datos de la contraparte sincronizados en el libro mayor:",
			counterparty,
		);
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
				<AIChatInterface copilot={copilot} />
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

				<form onSubmit={handleSaveCounterparty} className="space-y-6">
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

					<div className="mt-4 flex justify-end">
						<Button
							type="submit"
							className="flex h-11 items-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-white shadow-sm transition-colors hover:bg-primary/95"
						>
							<Save className="size-4" /> Guardar Datos de Contraparte
						</Button>
					</div>
				</form>
			</Card>

			<div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<Link
					href="/citizen/cases/new"
					className="flex items-center gap-2 font-semibold text-on-surface-variant text-sm transition-colors hover:text-primary"
				>
					<ArrowLeft className="size-4" /> Volver a opciones de registro
				</Link>
				<Button className="flex h-12 items-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-sm text-white shadow-md transition-colors hover:bg-primary/90">
					<Send className="size-4" /> Enviar Demanda
				</Button>
			</div>
		</main>
	);
}
