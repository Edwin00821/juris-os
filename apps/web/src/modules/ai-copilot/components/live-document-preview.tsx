"use client";

import { Button } from "@juris-os/ui/components/button";
import { Card, CardContent, CardHeader } from "@juris-os/ui/components/card";
import { Progress } from "@juris-os/ui/components/progress";
import { ScrollArea } from "@juris-os/ui/components/scroll-area";
import { cn } from "@juris-os/ui/lib/utils";
import {
	BookOpen,
	CircleDollarSign,
	Copy,
	Download,
	FileText,
	Gavel,
	Loader2,
	RefreshCw,
	Sparkles,
	User,
	UserSearch,
} from "lucide-react";
import * as React from "react";
import Markdown from "react-markdown";

import type { useAICopilot } from "../hooks/use-ai-copilot";

interface LiveDocumentPreviewProps {
	copilot: ReturnType<typeof useAICopilot>;
	className?: string;
}

function Field({
	label,
	value,
	icon: Icon,
	placeholder,
}: {
	label: string;
	value: string | null;
	icon: React.ElementType;
	placeholder: string;
}) {
	const empty = !value;
	return (
		<div>
			<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
				<Icon className="size-3.5 text-outline" /> {label}
			</h4>
			<div
				className={cn(
					"rounded-lg bg-surface-container p-4 text-sm leading-relaxed transition-all duration-300",
					empty
						? "text-on-surface-variant italic opacity-70"
						: "text-foreground",
				)}
			>
				{empty ? placeholder : value}
			</div>
		</div>
	);
}

export function LiveDocumentPreview({
	copilot,
	className,
}: LiveDocumentPreviewProps) {
	const {
		progress,
		caseData,
		plaintiff,
		canGenerate,
		generatedDocument,
		isGenerating,
		generateError,
		generateDocument,
		copyDocument,
		downloadPdf,
	} = copilot;

	const [copied, setCopied] = React.useState(false);

	const handleCopy = async () => {
		await copyDocument();
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card
			className={cn(
				"flex h-180 flex-col overflow-hidden rounded-xl border-outline-variant bg-surface-container-lowest shadow-sm",
				className,
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 border-outline-variant border-b bg-surface-container-low px-6 py-4">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed">
						<FileText className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-bold font-headline text-primary text-sm">
							Documento de Demanda
						</h3>
						<span className="block font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
							{generatedDocument
								? "Documento generado"
								: "Se actualiza en tiempo real"}
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="size-9 text-on-surface-variant hover:bg-surface-container"
						title="Descargar PDF"
						onClick={downloadPdf}
						disabled={!generatedDocument}
					>
						<Download className="size-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="size-9 text-on-surface-variant hover:bg-surface-container"
						title={copied ? "¡Copiado!" : "Copiar Contenido"}
						onClick={handleCopy}
						disabled={!generatedDocument}
					>
						<Copy className={cn("size-5", copied && "text-green-500")} />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden bg-surface-container-lowest p-0">
				<ScrollArea className="h-full p-8">
					{generatedDocument ? (
						<article className="prose prose-sm mx-auto max-w-lg prose-headings:font-headline prose-headings:text-primary prose-strong:text-foreground text-foreground">
							<Markdown>{generatedDocument}</Markdown>
						</article>
					) : (
						<div className="mx-auto max-w-lg">
							<div className="mb-8 border-outline-variant border-b pb-6 text-center">
								<p className="mb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[.3em]">
									Sistema Judicial Soberano
								</p>
								<h2 className="mb-1 font-extrabold font-headline text-primary text-xl tracking-tight">
									DEMANDA{" "}
									{caseData.category === "criminal"
										? "PENAL"
										: caseData.category === "family"
											? "FAMILIAR"
											: caseData.category === "labor"
												? "LABORAL"
												: "CIVIL"}
								</h2>
								{caseData.title && (
									<p className="mt-2 font-medium text-foreground text-sm">
										{caseData.title}
									</p>
								)}
							</div>

							<div className="space-y-6">
								<Field
									label="Datos del Demandante"
									icon={User}
									value={plaintiff.name}
									placeholder="Pendiente — no se detectó su nombre en la sesión."
								/>

								<Field
									label="Datos del Demandado"
									icon={UserSearch}
									value={caseData.counterpartyName}
									placeholder="Pendiente — complete la sección de contraparte o indíquelo en el chat."
								/>

								<Field
									label="Hechos"
									icon={BookOpen}
									value={caseData.description}
									placeholder="Pendiente — describa los hechos en el chat."
								/>

								<Field
									label="Fundamentos de Derecho"
									icon={Gavel}
									value={caseData.legalBasis}
									placeholder="Pendiente — se generará automáticamente conforme avancen los hechos."
								/>

								<Field
									label="Pretensiones"
									icon={CircleDollarSign}
									value={caseData.claims}
									placeholder="Indique qué solicita al tribunal."
								/>
							</div>

							<div className="mt-8 border-outline-variant border-t pt-6">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
										Progreso del Documento
									</span>
									<span className="font-bold text-[10px] text-primary">
										{progress}%
									</span>
								</div>
								<Progress
									value={progress}
									className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
								/>
							</div>
						</div>
					)}
				</ScrollArea>
			</CardContent>

			<div className="border-outline-variant border-t bg-surface-container-low px-6 py-4">
				{generateError && (
					<p className="mb-3 rounded-lg bg-error-container px-3 py-2 text-center text-on-error-container text-xs">
						{generateError}
					</p>
				)}
				<Button
					onClick={generateDocument}
					disabled={!canGenerate || isGenerating}
					className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-sm text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
					title={
						canGenerate
							? "Generar el escrito de demanda"
							: "Complete título, hechos y pretensiones en el chat para habilitar la generación"
					}
				>
					{isGenerating ? (
						<>
							<Loader2 className="size-4 animate-spin" /> Generando documento...
						</>
					) : generatedDocument ? (
						<>
							<RefreshCw className="size-4" /> Regenerar documento
						</>
					) : (
						<>
							<Sparkles className="size-4" /> Generar documento
						</>
					)}
				</Button>
			</div>
		</Card>
	);
}
