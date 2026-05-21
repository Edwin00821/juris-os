import { useQuery } from "@tanstack/react-query";

export interface CitizenProfile {
	name: string;
	verifiedId: string;
	avatarUrl: string;
}

async function fetchCitizenProfile(): Promise<CitizenProfile> {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return {
		name: "Marcus Vane",
		verifiedId: "SVN-9921-X",
		avatarUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCCkKdw-6RgGJodHkRVv5oWuCZQvo8XvlB4zt7zoP7AE2w6FfDGtDLLjK0SPUoEM5_oR7r5eMWgX_CSw_-rlhzChU4VlQIpNe8k2G6lZbLHSgN6oNQq6zYDloWUmBJK9NTfNbJwIEVOYHg7WiZwcTFUpJyvvt26--sptTSneq0OTdxY0xfROtG80shJ5r5M1UvBocFFPm0VZhN82CaWe2_ldoCrQAYN4Z1_XBIyUPcU0iKLHXyfbRd7GH88e5_aeOhNLsXLk34JUMk",
	};
}

export function useCitizenProfile() {
	return useQuery({
		queryKey: ["citizen-profile"],
		queryFn: fetchCitizenProfile,
	});
}
