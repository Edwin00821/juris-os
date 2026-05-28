import type {
	ICaseRepository,
	PaginationParams,
} from "../../infrastructure/repositories/case.repository";
import {
	type PaginatedJudgeCasesDto,
	toJudgeCaseListItem,
} from "../dtos/case.response.dto";

export class ListJudgeCasesUseCase {
	constructor(private readonly repo: ICaseRepository) {}

	async execute(
		judgeId: string,
		pagination: PaginationParams,
	): Promise<PaginatedJudgeCasesDto> {
		const { data, totalCount } = await this.repo.findAllByJudge(
			judgeId,
			pagination,
		);

		return {
			data: data.map(toJudgeCaseListItem),
			totalCount,
			totalPages: Math.ceil(totalCount / pagination.pageSize),
		};
	}
}
