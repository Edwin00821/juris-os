import { HTTPException } from "hono/http-exception";
import { eventBus } from "../../../../core/events/event-bus";
import type { ICaseRepository } from "../../infrastructure/repositories/case.repository";

interface AssignCaseInput {
	caseNumber: string;
	judgeId: string;
	requestedBy: string;
}

export class AssignCaseUseCase {
	constructor(private readonly caseRepo: ICaseRepository) {}

	async execute({
		caseNumber,
		judgeId,
		requestedBy,
	}: AssignCaseInput): Promise<void> {
		const existing = await this.caseRepo.findByCaseNumber(caseNumber);

		if (!existing) {
			throw new HTTPException(404, {
				message: `El caso ${caseNumber} no existe`,
			});
		}

		if (existing.judgeId !== null && existing.judgeId !== undefined) {
			throw new HTTPException(409, {
				message: `El caso ${caseNumber} ya tiene un juez asignado`,
			});
		}

		await this.caseRepo.assignJudge(existing.id, judgeId);

		eventBus.emit({
			id: crypto.randomUUID(),
			type: "CaseAssigned",
			occurredAt: new Date(),
			payload: {
				caseId: existing.id,
				caseNumber: existing.caseNumber,
				judgeId,
				assignedBy: requestedBy,
			},
		});
	}
}
