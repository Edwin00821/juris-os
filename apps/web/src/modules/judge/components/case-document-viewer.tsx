export function CaseDocumentViewer() {
	return (
		<div className="mx-auto min-h-200 max-w-[65ch] bg-surface-container-lowest p-12 text-on-surface shadow-sm">
			<div className="mb-12 text-center">
				<h1 className="font-bold text-lg text-on-surface-variant uppercase tracking-widest">
					Demanda Formal de Justicia Laboral
				</h1>
				<p className="mt-2 text-on-surface-variant text-xs">
					Registro del Caso: #2024-XP-082
				</p>
			</div>

			<div className="space-y-6 font-body text-on-surface text-sm leading-relaxed">
				<p>Al Honorable Juez del Tribunal Laboral de Distrito,</p>

				<p>
					<strong className="font-bold">I. DECLARACIÓN PRELIMINAR:</strong> El
					demandante, MARCO HERNANDEZ, por la presente inicia esta acción legal
					contra URBAN LOGISTICS CORP, para la recuperación de beneficios
					laborales no pagados y daños derivados de un despido ilegal y sumario
					ejecutado en la fecha del 12 de septiembre de 2024.
				</p>

				<p>
					<strong className="font-bold">II. DECLARACIÓN DE LOS HECHOS:</strong>{" "}
					Durante tres años, el demandante se desempeñó como Despachador Senior
					con un historial disciplinario impecable. En la fecha antes
					mencionada, sin previo aviso ni causa, el departamento de Recursos
					Humanos del demandado revocó todas las credenciales digitales y ordenó
					al demandante desalojar las instalaciones de inmediato.
				</p>

				<div className="group relative -mx-4 rounded border-primary border-l-4 bg-primary-fixed/30 p-4">
					<div className="absolute top-0 -right-2 rounded bg-primary px-2 py-0.5 font-bold text-[8px] text-white uppercase">
						Destacado por IA
					</div>
					<p className="font-medium text-primary italic">
						"El demandado no proporcionó el período de notificación obligatorio
						de 30 días estipulado en la Sección 4.2 del Convenio Colectivo de
						Trabajo. Además, el paquete de indemnización ofrecido ($2,400) cubre
						menos del 5% del requisito legal."
					</p>
				</div>

				<p>
					<strong className="font-bold">III. ANEXOS DE EVIDENCIA:</strong>
				</p>
				<ul className="list-disc space-y-2 pl-5">
					<li>
						<strong>Anexo A:</strong> Contrato de Empleo Firmado (2021).
					</li>
					<li>
						<strong>Anexo B:</strong> Declaración Notariada del Testigo Elena
						Vance.
					</li>
					<li>
						<strong>Anexo C:</strong> Registros Digitales de revocación de
						acceso (Fuente: Auditoría de TI).
					</li>
				</ul>

				<p>
					Bajo pena de perjurio, certifico que los hechos aquí presentados son
					verdaderos a mi leal saber y entender, y que esta acción no se
					presenta con el propósito de acoso o retraso innecesario.
				</p>

				<div className="mt-20 flex justify-between border-on-surface-variant/20 border-t pt-4">
					<div className="text-center">
						<div className="mb-2 h-1 w-32 bg-on-surface-variant/20" />
						<p className="font-bold text-[10px] uppercase">
							Firma del Demandante
						</p>
					</div>
					<div className="text-center">
						<div className="mb-2 h-1 w-32 bg-on-surface-variant/20" />
						<p className="font-bold text-[10px] uppercase">Asesor Legal</p>
					</div>
				</div>
			</div>
		</div>
	);
}
