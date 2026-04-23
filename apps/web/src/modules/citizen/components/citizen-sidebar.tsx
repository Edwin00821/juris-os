import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@juris-os-/ui/components/avatar";
import { Badge } from "@juris-os-/ui/components/badge";
import { Button } from "@juris-os-/ui/components/button";
import { Card, CardContent } from "@juris-os-/ui/components/card";
import { Clock, Plus, Scale } from "lucide-react";

export function CitizenSidebar() {
	return (
		<aside className="flex w-full flex-col gap-6 md:w-80">
			<Card className="border-none py-6">
				<CardContent className="flex flex-col items-center text-center">
					<Avatar size="xl" className="mb-4 bg-primary-fixed">
						<AvatarImage
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCkKdw-6RgGJodHkRVv5oWuCZQvo8XvlB4zt7zoP7AE2w6FfDGtDLLjK0SPUoEM5_oR7r5eMWgX_CSw_-rlhzChU4VlQIpNe8k2G6lZbLHSgN6oNQq6zYDloWUmBJK9NTfNbJwIEVOYHg7WiZwcTFUpJyvvt26--sptTSneq0OTdxY0xfROtG80shJ5r5M1UvBocFFPm0VZhN82CaWe2_ldoCrQAYN4Z1_XBIyUPcU0iKLHXyfbRd7GH88e5_aeOhNLsXLk34JUMk"
							alt="Marcus Vane"
						/>
						<AvatarFallback>MV</AvatarFallback>
					</Avatar>
					<h2 className="font-bold font-headline text-lg text-primary">
						Marcus Vane
					</h2>
					<p className="mb-4 text-on-surface-variant text-sm">
						ID de Ciudadano Verificado:{" "}
						<span className="font-mono font-semibold text-primary">
							SVN-9921-X
						</span>
					</p>
					<Button className="w-full gap-2">
						<Plus className="size-5" />
						Registrar Nuevo Caso
					</Button>
				</CardContent>
			</Card>

			<div className="rounded-xl bg-surface-container p-6">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-bold font-headline text-foreground text-xs uppercase tracking-widest">
						Actualizaciones en Vivo
					</h3>
					<Badge variant="optimal">3 NUEVAS</Badge>
				</div>
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="rounded-lg bg-secondary-container p-1.5">
							<Clock className="size-4 text-on-secondary-container" />
						</div>
						<div>
							<p className="font-semibold text-sm">Audiencia Programada</p>
							<p className="text-on-surface-variant text-xs">
								Caso #2024-DR-082 actualizado por el Secretario.
							</p>
							<p className="mt-1 text-[10px] text-outline">Hace 14 min</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="rounded-lg bg-primary-fixed p-1.5">
							<Scale className="size-4 text-on-primary-fixed" />
						</div>
						<div>
							<p className="font-semibold text-sm">Firma Requerida</p>
							<p className="text-on-surface-variant text-xs">
								El borrador del Generador de Demandas necesita aprobación.
							</p>
							<p className="mt-1 text-[10px] text-outline">Hace 2 horas</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
