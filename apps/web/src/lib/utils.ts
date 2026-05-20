export function getInitials(name?: string) {
	if (!name) return "";
	const [first, second] = name.split(" ");
	return (first?.[0] ?? "") + (second?.[0] ?? "");
}
