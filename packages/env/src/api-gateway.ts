import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		GEMINI_API_KEY: z.string().min(1),
		// Base URL of the Python FastAPI assignment engine (motor_asignacion_ia).
		MOTOR_IA_URL: z.url().default("http://localhost:8000"),
	},
	client: {},
	clientPrefix: "NEXT_PUBLIC_",

	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
