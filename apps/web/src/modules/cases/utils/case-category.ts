export const CASE_CATEGORY_MAP: Record<string, string> = {
	criminal: "Penal",
	family: "Familia",
	labor: "Laboral",
};

export function getCategoryLabel(category: string): string {
	return CASE_CATEGORY_MAP[category] || category;
}
