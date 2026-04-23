"use client";

import { Button } from "@juris-os-/ui/components/button";
import { AlertTriangle, Lock } from "lucide-react";

interface ImmutabilityProtocolProps {
	onSaveDraft: () => void;
	onCloseCase: () => void;
	isSubmitting?: boolean;
}

export function ImmutabilityProtocol({
	onSaveDraft,
	onCloseCase,
	isSubmitting = false,
}: ImmutabilityProtocolProps) {
	return (
		<div className="mt-12 border-outline-variant/30 border-t pt-8">
			<div className="flex items-start gap-4 rounded-xl border border-destructive/10 bg-error-container/40 p-6">
				<AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-destructive" />
				<div>
					<h4 className="font-bold text-destructive text-sm">
						CRÍTICO: PROTOCOLO DE INMUTABILIDAD
					</h4>
					<p className="mt-1 text-destructive/80 text-xs leading-relaxed">
						Cerrar este caso generará un hash criptográfico de todos los
						documentos y la sentencia final. Una vez ejecutado, no se podrán
						realizar más modificaciones, adendas o correcciones a esta entrada
						del libro mayor digital. Asegúrese de que todas las citaciones sean
						precisas.
					</p>
				</div>
			</div>
			<div className="mt-8 flex justify-end gap-4">
				<Button onClick={onSaveDraft} disabled={isSubmitting}>
					Guardar como Borrador
				</Button>
				<Button
					onClick={onCloseCase}
					disabled={isSubmitting}
					variant="destructive"
				>
					<Lock className="mr-2 h-4 w-4" />
					Cerrar Caso y Publicar Sentencia
				</Button>
			</div>
		</div>
	);
}
