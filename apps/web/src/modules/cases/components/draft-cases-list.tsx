"use client";

import { Button, buttonVariants } from "@juris-os/ui/components/button";
import { Card } from "@juris-os/ui/components/card";
import { ArrowRight, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDraftStore } from "../stores/draft.store";

export function DraftCasesList() {
	const drafts = useDraftStore((state) => state.drafts);
	const deleteDraft = useDraftStore((state) => state.deleteDraft);

	const handleDeleteDraft = (id: string) => {
		deleteDraft(id);
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (drafts.length === 0) {
		return null;
	}

	return (
		<Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-none">
			<div className="mb-6 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 bg-warning-fixed">
					<FileText className="size-5 text-warning" />
				</div>
				<div>
					<h3 className="font-bold font-headline text-lg text-warning">
						Borradores Guardados
					</h3>
					<p className="text-on-surface-variant text-xs">
						{drafts.length} {drafts.length === 1 ? "borrador" : "borradores"}
					</p>
				</div>
			</div>

			<div className="space-y-3">
				{drafts.map((draft) => (
					<div
						key={draft.id}
						className="flex items-start justify-between gap-4 rounded-lg border border-outline-variant/50 bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
					>
						<div className="flex-1">
							<h4 className="font-semibold text-on-surface">
								{draft.title || "Demanda sin título"}
							</h4>
							<p className="mt-1 line-clamp-2 text-on-surface-variant text-sm">
								{draft.description || "Sin descripción"}
							</p>
							<p className="mt-2 text-on-surface-variant text-xs">
								Guardado: {formatDate(draft.savedAt)}
							</p>
						</div>

						<div className="flex gap-2">
							<Link
								href={`/citizen/cases/new/manual?draftId=${draft.id}`}
								className={buttonVariants({
									variant: "outline",
									size: "sm",
									className:
										"border-primary bg-primary/10 text-primary hover:bg-primary/20",
								})}
							>
								<ArrowRight className="size-4" />
								Continuar
							</Link>

							<Button
								type="button"
								variant="outline"
								size="sm"
								className="border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
								onClick={() => handleDeleteDraft(draft.id)}
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
