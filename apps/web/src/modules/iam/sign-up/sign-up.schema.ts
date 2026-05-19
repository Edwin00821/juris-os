import { z } from "zod";

export const signUpSchema = z.object({
	name: z.string().min(1, "El nombre completo es requerido"),
	email: z.email("Correo electrónico inválido"),
	password: z.string().min(1, "La contraseña es requerida"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
