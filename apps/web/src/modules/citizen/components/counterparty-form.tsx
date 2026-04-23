import { Button } from "@juris-os-/ui/components/button";
import { Input } from "@juris-os-/ui/components/input";
import { Label } from "@juris-os-/ui/components/label";
import { UserSearch } from "lucide-react";

export function CounterpartyForm() {
	return (
		<div className="rounded-xl bg-surface-container-high p-8">
			<div className="mb-8 flex items-center gap-4">
				<div className="flex size-12 items-center justify-center rounded-lg bg-surface-container-lowest text-primary">
					<UserSearch className="size-6" />
				</div>
				<div>
					<h3 className="font-bold font-headline text-primary text-xl">
						Información de la Contraparte
					</h3>
					<p className="text-on-surface-variant text-sm">
						Proporcione los detalles de la parte contra la que está presentando
						la demanda.
					</p>
				</div>
			</div>

			<form className="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div className="flex flex-col gap-2">
					<Label htmlFor="legal-name">Nombre Legal Completo</Label>
					<Input
						id="legal-name"
						placeholder="Nombre de la Persona o Corporación"
						variant="filled"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="address">Dirección Registrada</Label>
					<Input
						id="address"
						placeholder="Av. Justicia 123, Piso 4"
						variant="filled"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="entity-id">ID de la Entidad (Opcional)</Label>
					<Input
						id="entity-id"
						placeholder="# de Registro Comercial"
						variant="filled"
					/>
				</div>
			</form>

			<div className="mt-8 flex justify-end">
				<Button className="bg-tertiary-container text-tertiary-fixed hover:bg-tertiary-container/90">
					Guardar Detalles de la Entidad
				</Button>
			</div>
		</div>
	);
}
