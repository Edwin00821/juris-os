"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@juris-os/ui/components/breadcrumb";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { AILawsuitCard } from "../components/ai-lawsuit-card";
import { ManualLawsuitCard } from "../components/manual-lawsuit-card";

export function NewCaseSelectorPage() {
	return (
		<main className="mx-auto flex w-full max-w-275 grow flex-col gap-8 px-4 py-10 md:px-8">
			<Breadcrumb>
				<BreadcrumbList className="gap-2 text-on-surface-variant text-sm sm:gap-2">
					<BreadcrumbItem>
						<BreadcrumbLink
							render={
								<Link
									href="/citizen"
									className="flex items-center gap-1 font-semibold transition-colors hover:text-primary"
								>
									<ArrowLeft className="size-4" />
									Panel del Ciudadano
								</Link>
							}
						/>
					</BreadcrumbItem>

					<BreadcrumbSeparator className="[&>svg]:size-4" />

					<BreadcrumbItem>
						<BreadcrumbPage className="font-semibold text-primary">
							Registrar Nuevo Caso
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<section>
				<h1 className="mb-2 font-extrabold font-headline text-3xl text-primary tracking-tight">
					Registrar Nuevo Caso
				</h1>
				<p className="max-w-2xl text-on-surface-variant text-sm leading-relaxed">
					Seleccione cómo desea iniciar su nueva demanda. Puede utilizar nuestro
					asistente de Inteligencia Artificial para una guía paso a paso, o
					redactar su demanda de forma manual si ya tiene la información
					preparada.
				</p>
			</section>

			<div className="mt-2 grid grid-cols-1 gap-8 md:grid-cols-2">
				<AILawsuitCard />
				<ManualLawsuitCard />
			</div>

			<div className="mt-2 flex items-start gap-4 rounded-xl border border-primary-fixed bg-primary-fixed/40 p-5">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed">
					<HelpCircle className="size-5 text-primary" />
				</div>
				<div>
					<h4 className="mb-1 font-bold font-headline text-primary text-sm">
						¿No sabe cuál elegir?
					</h4>
					<p className="text-on-surface-variant text-sm leading-relaxed">
						Si es su primera vez registrando un caso, le recomendamos usar el{" "}
						<strong className="text-primary">
							Generador de Demandas con IA
						</strong>
						. El asistente le hará preguntas sencillas y se encargará de
						estructurar toda la información legal por usted.
					</p>
				</div>
			</div>
		</main>
	);
}
