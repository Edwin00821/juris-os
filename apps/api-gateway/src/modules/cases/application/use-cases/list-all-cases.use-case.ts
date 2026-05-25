import type {
	ICaseRepository,
	PaginationParams,
} from "../../infrastructure/repositories/case.repository";
import {
	type PaginatedCasesDto,
	toCaseResponse,
} from "../dtos/case.response.dto";

export class ListAllCasesUseCase {
	constructor(private readonly repo: ICaseRepository) {}

	async execute(pagination: PaginationParams): Promise<PaginatedCasesDto> {
		const { data, totalCount } = await this.repo.findAll(pagination);

		return {
			data: data.map(toCaseResponse),
			totalCount,
			totalPages: Math.ceil(totalCount / pagination.pageSize),
		};
	}
}
