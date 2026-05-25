import { parseAsInteger, useQueryStates } from "nuqs";

export function useAssignCaseTableParams() {
	const [params, setParams] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(10),
	});

	return {
		page: params.page,
		pageSize: params.pageSize,
		setPagination: (updater: { page?: number; pageSize?: number }) =>
			setParams((prev) => ({ ...prev, ...updater })),
	};
}
