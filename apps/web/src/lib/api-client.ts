// lib/api-client.ts
export async function apiClient<T>(
	endpoint: string, // ej: "/cases"
	options: RequestInit = {},
): Promise<T> {
	const headers = new Headers(options.headers);

	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`/api/proxy${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error || `Error en la petición: ${response.status}`,
		);
	}

	return response.json() as Promise<T>;
}
