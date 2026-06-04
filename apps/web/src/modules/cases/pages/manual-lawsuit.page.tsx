"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@juris-os/ui/components/breadcrumb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ManualLawsuitForm } from "../components/manual-lawsuit-form";

export function ManualLawsuitPage() {
	return (
		<main className="mx-auto flex w-full max-w-275 grow flex-col gap-8 px-4 py-10 text-foreground md:px-8">
			<Breadcrumb>
				<BreadcrumbList className="gap-2 text-on-surface-variant text-sm">
					<BreadcrumbItem>
						<BreadcrumbLink
							render={
								<Link
									href="/citizen"
									className="flex items-center gap-1 font-semibold transition-colors hover:text-primary"
								>
									<ArrowLeft className="size-4" /> Panel del Ciudadano
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
									Registrar Nuevo Caso
								</Link>
							}
						/>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="[&>svg]:size-4" />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-semibold text-primary">
							Demanda Manual
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Encabezado */}
			<section>
				<h1 className="mb-2 font-extrabold font-headline text-3xl text-primary tracking-tight">
					Demanda Manual
				</h1>
				<p className="max-w-2xl text-on-surface-variant text-sm leading-relaxed">
					Complete los datos de su caso, suba los documentos de respaldo y
					proporcione la información de la contraparte para generar su demanda.
				</p>
			</section>

			<div className="flex w-full max-w-xl items-center gap-0">
				<div className="flex flex-col items-center gap-1">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-sm text-white shadow-sm">
						1
					</div>
					<span className="font-bold text-[10px] text-primary uppercase tracking-wider">
						Datos
					</span>
				</div>
				<div className="mx-1 h-0.5 flex-1 bg-primary" />
				<div className="flex flex-col items-center gap-1">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-sm text-white shadow-sm">
						2
					</div>
					<span className="font-bold text-[10px] text-primary uppercase tracking-wider">
						Archivos
					</span>
				</div>
				<div className="mx-1 h-0.5 flex-1 bg-primary" />
				<div className="flex flex-col items-center gap-1">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-sm text-white shadow-sm">
						3
					</div>
					<span className="font-bold text-[10px] text-primary uppercase tracking-wider">
						Contraparte
					</span>
				</div>
			</div>

			<ManualLawsuitForm />
		</main>
	);
}
