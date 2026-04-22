import { CheckCircle2 } from "lucide-react";

export function StatusBanner() {
  return (
    <div className="mt-8 flex items-center gap-6 rounded-xl border-primary border-l-4 bg-surface-container-low p-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
        <CheckCircle2 className="size-6 text-primary" strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="mb-1 font-bold font-headline text-primary text-sm">
          Registro Pendiente
        </h4>
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Su solicitud ha sido enviada. Un Secretario Principal verificará sus
          credenciales en un plazo de 24 horas.
        </p>
      </div>
    </div>
  );
}
