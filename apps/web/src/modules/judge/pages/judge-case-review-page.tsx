import { Button } from "@juris-os-/ui/components/button";
import { CaseDocumentViewer } from "../components/case-document-viewer";
import { CompensationWidget } from "../components/compensation-widget";
import { LegalInsightSummary } from "../components/legal-insight-summary";
import { LegalSemanticSearch } from "../components/legal-semantic-search";

export function JudgeCaseReviewPage() {
	return (
		<main className="relative flex flex-1 flex-col overflow-hidden bg-surface">
			<LegalSemanticSearch />

			<div className="no-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
				<div className="flex items-center justify-between border-outline-variant/10 border-b pb-6">
					<div>
						<h2 className="font-extrabold font-headline text-2xl text-primary tracking-tight">
							Hernandez vs. Urban Logistics Corp.
						</h2>
						<p className="mt-1 font-body text-on-surface-variant text-sm">
							Fecha de Presentación: 14 de Octubre de 2024 | Tribunal: Distrito
							04
						</p>
					</div>
					<div className="flex gap-3">
						<Button>Admitida</Button>
						<Button variant="secondary">Prevenida</Button>
						<Button variant="destructive">Desechada</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<LegalInsightSummary />
					<CompensationWidget />
				</div>

				<CaseDocumentViewer />
			</div>
		</main>
	);
}
