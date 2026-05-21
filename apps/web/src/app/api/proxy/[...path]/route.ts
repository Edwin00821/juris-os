import { env } from "@juris-os/env/web";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const HONO_BASE_URL = env.NEXT_PUBLIC_API_GATEWAY;

async function handleRequest(
	req: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const reqHeaders = await headers();
	const response = await auth.api.getSession({
		headers: reqHeaders,
		asResponse: true,
	});

	const jwt = response.headers.get("set-auth-jwt");

	if (!jwt) {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	// 2. Construir la URL exacta para Hono
	const resolvedParams = await params;
	const path = resolvedParams.path.join("/");
	const url = new URL(req.url);
	const honoUrl = `${HONO_BASE_URL}/${path}${url.search}`;

	const fetchHeaders = new Headers(req.headers);
	fetchHeaders.set("Authorization", `Bearer ${jwt}`);

	fetchHeaders.delete("host");
	fetchHeaders.delete("cookie");

	const honoResponse = await fetch(honoUrl, {
		method: req.method,
		headers: fetchHeaders,
		body:
			req.method !== "GET" && req.method !== "HEAD"
				? await req.text()
				: undefined,
	});

	const data = await honoResponse.json().catch(() => ({}));
	return NextResponse.json(data, { status: honoResponse.status });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
