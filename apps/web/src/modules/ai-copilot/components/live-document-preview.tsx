"use client";

import { Button } from "@juris-os/ui/components/button";
// Componentes del núcleo de Shadcn UI
import { Card, CardContent, CardHeader } from "@juris-os/ui/components/card";
import { Progress } from "@juris-os/ui/components/progress";
import { ScrollArea } from "@juris-os/ui/components/scroll-area";
import { cn } from "@juris-os/ui/lib/utils";
import {
	Badge,
	BookOpen,
	CircleDollarSign,
	Copy,
	Download,
	FileText,
	Gavel,
	UserSearch,
} from "lucide-react";

import type { useAICopilot } from "../hooks/use-ai-copilot";

interface LiveDocumentPreviewProps {
	copilot: ReturnType<typeof useAICopilot>;
	className?: string;
}

export function LiveDocumentPreview({
	copilot,
	className,
}: LiveDocumentPreviewProps) {
	const { progress } = copilot;

	const demandanteText =
		progress > 0
			? "Marcus Vane — Verificado (ID: SVN-9921-X)"
			: "Pendiente — el asistente recopilará esta información.";
	const demandadoText =
		progress > 40
			? "CloudCorp Logistics S.A. de C.V."
			: "Pendiente — complete la sección de contraparte o indíquelo en el chat.";
	const hechosText =
		progress > 20
			? "1. El pasado 12 de Octubre de 2024, la empresa contratada CloudCorp Logistics incumplió flagrantemente con tres ventanas de entrega consecutivas estipuladas en el acuerdo comercial..."
			: "Pendiente — describa los hechos en el chat.";
	const fundamentosText =
		progress > 60
			? "Artículos 1792, 1796 y 1840 del Código Civil Federal en materia de incumplimiento de obligaciones contractuales y cláusulas penales penarias."
			: "Pendiente — se generará automáticamente conforme avancen los hechos.";
	const pretensionesText =
		progress > 80
			? "La rescisión formal del contrato de prestación de servicios, la devolución íntegra del costo de envío y el pago de la indemnización por daños y perjuicios moratorios."
			: "Indique qué solicita al tribunal.";

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
							Se actualiza en tiempo real
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="size-9 text-on-surface-variant hover:bg-surface-container"
						title="Descargar PDF"
					>
						<Download className="size-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="size-9 text-on-surface-variant hover:bg-surface-container"
						title="Copiar Contenido"
					>
						<Copy className="size-5" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden bg-surface-container-lowest p-0">
				<ScrollArea className="h-full p-8">
					<div className="mx-auto max-w-lg">
						<div className="mb-8 border-outline-variant border-b pb-6 text-center">
							<p className="mb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[.3em]">
								Sistema Judicial Soberano
							</p>
							<h2 className="mb-1 font-extrabold font-headline text-primary text-xl tracking-tight">
								DEMANDA CIVIL
							</h2>
							<p className="font-medium text-outline text-xs">
								Expediente:{" "}
								<span className="rounded bg-surface-container-low px-1.5 py-0.5 font-mono text-primary">
									TSJ-2026-MOCK
								</span>
							</p>
						</div>

						<div className="space-y-6">
							<div>
								<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
									<Badge className="size-3.5 text-outline" /> Datos del
									Demandante
								</h4>
								<div
									className={cn(
										"rounded-lg bg-surface-container p-4 text-sm transition-all duration-300",
										progress === 0
											? "text-on-surface-variant italic opacity-70"
											: "font-medium text-foreground",
									)}
								>
									{demandanteText}
								</div>
							</div>

							<div>
								<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
									<UserSearch className="size-3.5 text-outline" /> Datos del
									Demandado
								</h4>
								<div
									className={cn(
										"rounded-lg bg-surface-container p-4 text-sm transition-all duration-300",
										progress <= 40
											? "text-on-surface-variant italic opacity-70"
											: "font-medium text-foreground",
									)}
								>
									{demandadoText}
								</div>
							</div>

							<div>
								<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
									<BookOpen className="size-3.5 text-outline" /> Hechos
								</h4>
								<div
									className={cn(
										"rounded-lg bg-surface-container p-4 text-sm leading-relaxed transition-all duration-300",
										progress <= 20
											? "text-on-surface-variant italic opacity-70"
											: "text-foreground",
									)}
								>
									{hechosText}
								</div>
							</div>

							<div>
								<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
									<Gavel className="size-3.5 text-outline" /> Fundamentos de
									Derecho
								</h4>
								<div
									className={cn(
										"rounded-lg bg-surface-container p-4 text-sm leading-relaxed transition-all duration-300",
										progress <= 60
											? "text-on-surface-variant italic opacity-70"
											: "text-foreground",
									)}
								>
									{fundamentosText}
								</div>
							</div>

							<div>
								<h4 className="mb-2 flex items-center gap-2 font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
									<CircleDollarSign className="size-3.5 text-outline" />{" "}
									Pretensiones
								</h4>
								<div
									className={cn(
										"rounded-lg bg-surface-container p-4 text-sm leading-relaxed transition-all duration-300",
										progress <= 80
											? "text-on-surface-variant italic opacity-70"
											: "font-medium text-foreground",
									)}
								>
									{pretensionesText}
								</div>
							</div>
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
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
