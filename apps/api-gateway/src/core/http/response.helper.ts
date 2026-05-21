import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export type ApiSuccess<T> = {
	success: true;
	data: T;
	meta?: Record<string, unknown>;
};

export type ApiError = {
	success: false;
	error: {
		code: string;
		message: string;
		issues?: { field: string; message: string }[];
	};
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const ok = <T>(
	c: Context,
	data: T,
	status: ContentfulStatusCode = 200,
	meta?: Record<string, unknown>,
) => {
	const body: ApiSuccess<T> = { success: true, data };
	if (meta) body.meta = meta;
	return c.json(body, status);
};

export const created = <T>(c: Context, data: T) => ok(c, data, 201);

export const fail = (
	c: Context,
	code: string,
	message: string,
	status: ContentfulStatusCode = 400,
) => {
	const body: ApiError = { success: false, error: { code, message } };
	return c.json(body, status);
};
