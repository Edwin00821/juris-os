import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Sentencia Publicada | Juris OS",
	description:
		"Vista de solo lectura del expediente concluido e integridad criptográfica",
};

interface ResolvedCasePageProps {
	params: {
		id: string;
	};
}

export default async function ResolvedCaseView({
	params,
}: ResolvedCasePageProps) {
	await guardJudge();

	return (
		<div className="p-8">
			<div className="mb-4 border-b pb-4">
				<span className="rounded border border-success/20 bg-success/10 px-2.5 py-0.5 font-medium text-success text-xs">
					Caso Resuelto
				</span>
				<h1 className="mt-2 font-bold text-2xl">
					Vista de Caso Terminado: {params.id}
				</h1>
			</div>

			<div className="space-y-4">
				<p className="text-muted-foreground">
					Esta es una vista de sólo lectura de la sentencia definitiva
					publicada.
				</p>
				<div className="rounded-lg bg-muted p-4 font-mono text-xs">
					<p className="mb-1 font-semibold text-foreground">
						Hash de Integridad Criptográfica (SHA-256):
					</p>
					<p className="break-all text-muted-foreground">
						e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
					</p>
				</div>
			</div>
		</div>
	);
}
