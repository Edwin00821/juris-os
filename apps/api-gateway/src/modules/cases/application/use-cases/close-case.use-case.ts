import { HTTPException } from "hono/http-exception";
import { eventBus } from "../../../../core/events/event-bus";
import type { CaseResolution } from "../../domain/case.types";
import type { ICaseRepository } from "../../infrastructure/repositories/case.repository";

interface CloseCaseInput {
	caseNumber: string;
	resolution: CaseResolution;
	resolutionText?: string;
	requestedBy: string;
}

export class CloseCaseUseCase {
	constructor(private readonly caseRepo: ICaseRepository) {}

	async execute({
		caseNumber,
		resolution,
		resolutionText,
		requestedBy,
	}: CloseCaseInput): Promise<void> {
		const existing = await this.caseRepo.findByCaseNumber(caseNumber);

		if (!existing) {
			throw new HTTPException(404, {
				message: `El caso ${caseNumber} no existe`,
			});
		}

		if (existing.judgeId !== requestedBy) {
			throw new HTTPException(403, {
				message: `No tienes permiso para cerrar el caso ${caseNumber}`,
			});
		}

		if (existing.status === "CLOSED") {
			throw new HTTPException(409, {
				message: `El caso ${caseNumber} ya está cerrado`,
			});
		}

		await this.caseRepo.closeCase(existing.id, resolution, resolutionText);

		eventBus.emit({
			id: crypto.randomUUID(),
			type: "CaseClosed",
			occurredAt: new Date(),
			payload: {
				caseId: existing.id,
				caseNumber: existing.caseNumber,
				resolution,
				closedBy: requestedBy,
			},
		});
	}
}
