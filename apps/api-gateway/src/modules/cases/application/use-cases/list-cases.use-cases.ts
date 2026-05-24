import type {
	ICaseRepository,
	PaginationParams,
} from "../../infrastructure/repositories/case.repository";
import {
	type PaginatedCasesDto,
	toCaseResponse,
} from "../dtos/case.response.dto";

export class ListCasesUseCase {
	constructor(private readonly repo: ICaseRepository) {}

	async execute(
		userId: string,
		pagination: PaginationParams,
	): Promise<PaginatedCasesDto> {
		const { data, totalCount } = await this.repo.findAllByUser(
			userId,
			pagination,
		);

		return {
			data: data.map(toCaseResponse),
			totalCount,
			totalPages: Math.ceil(totalCount / pagination.pageSize),
		};
	}
}
