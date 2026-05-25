export function AssignedCasesHeader() {
	return (
		<section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
					Casos Asignados
				</h1>
				<p className="mt-2">
					Consulte todos los casos que ya han sido asignados a un juez dentro
					del sistema.
				</p>
			</div>
		</section>
	);
}
