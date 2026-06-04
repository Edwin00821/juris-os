import { HTTPException } from "hono/http-exception";
import { eventBus } from "../../../../core/events/event-bus";
import type { ICaseRepository } from "../../infrastructure/repositories/case.repository";

interface UpdateCaseStatusInput {
	caseNumber: string;
	status: "UNDER_REVIEW" | "PENDING_RESOLUTION";
	requestedBy: string;
}

export class UpdateCaseStatusUseCase {
	constructor(private readonly caseRepo: ICaseRepository) {}

	async execute({
		caseNumber,
		status,
		requestedBy,
	}: UpdateCaseStatusInput): Promise<void> {
		const existing = await this.caseRepo.findByCaseNumber(caseNumber);

		if (!existing) {
			throw new HTTPException(404, {
				message: `El caso ${caseNumber} no existe`,
			});
		}

		if (existing.judgeId !== requestedBy) {
			throw new HTTPException(403, {
				message: `No tienes permiso para modificar el caso ${caseNumber}`,
			});
		}

		if (existing.status === "CLOSED") {
			throw new HTTPException(409, {
				message: `El caso ${caseNumber} está cerrado y no puede modificarse`,
			});
		}

		if (existing.status === status) return;

		await this.caseRepo.updateStatus(existing.id, status);

		eventBus.emit({
			id: crypto.randomUUID(),
			type: "CaseStatusChanged",
			occurredAt: new Date(),
			payload: {
				caseId: existing.id,
				previousStatus: existing.status,
				newStatus: status,
			},
		});
	}
}
