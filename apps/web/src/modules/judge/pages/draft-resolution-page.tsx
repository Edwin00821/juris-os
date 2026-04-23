"use client";

import { Button } from "@juris-os-/ui/components/button";
import { History } from "lucide-react";

import { CaseIntelligenceCard } from "@/modules/judge/components/case-intelligence-card";
import { JudicialCopilot } from "@/modules/judge/components/judicial-copilot";
import { ResolutionEditor } from "@/modules/judge/components/resolution-editor";

interface CaseData {
	id: string;
	title: string;
	dispute: string;
	filingDate: string;
	value: string;
	documents: {
		id: string;
		title: string;
	}[];
	copilotSuggestion: string;
	parties: string;
	preamble: string;
}

export default function DraftResolutionPage({
	caseData,
}: {
	caseData: CaseData;
}) {
	return (
		<main className="flex-1 bg-surface p-8">
			<div className="mb-10 flex items-center justify-between">
				<div>
					<h1 className="font-extrabold text-3xl text-primary tracking-tight">
						Expediente #{caseData.id}
					</h1>
					<p className="mt-1 font-medium text-muted-foreground">
						{caseData.title}
					</p>
				</div>
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 font-bold text-on-secondary-fixed text-sm">
						<span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
						REDACTANDO RESOLUCIÓN
					</span>
					<Button variant="ghost">
						<History className="h-5 w-5" />
						Historial de Borradores
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-8">
				<div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
					<CaseIntelligenceCard
						dispute={caseData.dispute}
						filingDate={caseData.filingDate}
						value={caseData.value}
						documents={caseData.documents}
					/>
					<JudicialCopilot initialSuggestion={caseData.copilotSuggestion} />
				</div>

				<div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
					<ResolutionEditor
						caseParties={caseData.parties}
						preamble={caseData.preamble}
					/>
				</div>
			</div>
		</main>
	);
}
