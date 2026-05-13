import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email("Correo electrónico inválido"),
	password: z.string().min(1, "La contraseña es requerida"),
	rememberMe: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;
