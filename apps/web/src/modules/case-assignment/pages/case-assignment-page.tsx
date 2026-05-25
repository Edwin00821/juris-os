import { AssignmentHeader } from "../components/assignment-header";
import { AvailableJudgesList } from "../components/available-judges-list";
import { PendingCasesList } from "../components/pending-cases-list";

export function CaseAssignmentPage() {
	return (
		<main className="min-h-screen flex-1 bg-surface p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<AssignmentHeader />

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					<div className="space-y-4 lg:col-span-5">
						<PendingCasesList />
					</div>

					<div className="space-y-4 lg:col-span-7">
						<AvailableJudgesList />
					</div>
				</div>
			</div>
		</main>
	);
}
