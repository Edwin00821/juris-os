"use client";

import { Button } from "@juris-os-/ui/components/button";
import { Bot, X } from "lucide-react";
import { useState } from "react";

export function AIInsightWidget() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="fixed right-8 bottom-8 z-50">
			<div className="flex max-w-sm items-center gap-4 rounded-xl border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-md">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
					<Bot className="h-6 w-6 text-white" />
				</div>
				<div>
					<p className="font-bold text-primary text-sm">Perspectiva Soberana</p>
					<p className="text-on-surface-variant text-xs">
						Los tiempos de resolución en el Tribunal de Familia han aumentado un
						15% esta semana. ¿Desea un informe detallado?
					</p>
				</div>
				<Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
					<X className="size-4 text-on-surface-variant" />
				</Button>
			</div>
		</div>
	);
}
