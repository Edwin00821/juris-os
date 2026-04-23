"use client";

import { AiSuggestion } from "@/modules/admin/components/ai-suggestion";
import { CitizenRegistry } from "@/modules/admin/components/citizen-registry";
import { DashboardHeader } from "@/modules/admin/components/dashboard-header";
import { PendingCases } from "@/modules/admin/components/pending-cases";

export function AdminDashboardPage() {
	return (
		<div className="mx-auto max-w-7xl space-y-8">
			<DashboardHeader />
			<CitizenRegistry />
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<PendingCases />
				<AiSuggestion />
			</div>
		</div>
	);
}
