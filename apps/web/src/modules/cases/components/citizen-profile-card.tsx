"use client";

import { Plus, User } from "lucide-react";
import Link from "next/link";
import { useCitizenProfile } from "../hooks/use-citizen-profile";

export function CitizenProfileCard() {
	const { data, isLoading, isError } = useCitizenProfile();

	if (isLoading) {
		return (
			<div className="animate-pulse rounded-xl border-none bg-surface-container-lowest p-6">
				<div className="flex flex-col items-center text-center">
					<div className="mb-4 h-20 w-20 rounded-full bg-surface-container-highest" />
					<div className="mb-2 h-5 w-32 rounded bg-surface-container-highest" />
					<div className="mb-4 h-4 w-48 rounded bg-surface-container-highest" />
					<div className="h-12 w-full rounded-md bg-surface-container-highest" />
				</div>
			</div>
		);
	}

	if (isError || !data) return null;

	return (
		<div className="rounded-xl border-none bg-surface-container-lowest p-6">
			<div className="flex flex-col items-center text-center">
				<div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-primary-fixed">
					{data.avatarUrl ? (
						// biome-ignore lint/performance/noImgElement: <>
						<img
							alt={`Avatar de ${data.name}`}
							className="h-full w-full object-cover"
							src={data.avatarUrl}
						/>
					) : (
						<User className="mt-5 size-10 text-primary" />
					)}
				</div>
				<h2 className="font-bold font-headline text-lg text-primary">
					{data.name}
				</h2>
				<p className="mb-4 text-on-surface-variant text-sm">
					ID de Ciudadano Verificado:{" "}
					<span className="font-mono font-semibold text-primary">
						{data.verifiedId}
					</span>
				</p>

				<Link
					href="/citizen/cases/new"
					className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white transition-all hover:bg-primary-container"
				>
					<Plus className="size-5" />
					Registrar Nuevo Caso
				</Link>
			</div>
		</div>
	);
}
