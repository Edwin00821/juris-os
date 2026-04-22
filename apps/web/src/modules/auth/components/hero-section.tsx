import { Gavel, ShieldCheck } from "lucide-react";

export function HeroSection() {
	return (
		<section className="relative hidden items-center justify-center overflow-hidden bg-primary p-12 md:flex md:w-1/2 lg:p-24">
			<div className="pointer-events-none absolute inset-0 opacity-20">
				{/** biome-ignore lint/performance/noImgElement: <> */}
				<img
					alt=""
					className="h-full w-full object-cover grayscale"
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUMsNyyFbY_Xj29u4PAGEbMqznl2GMTQh93cSCAgV6yLL8IXaQlnQoe8qnMiM_gnDnS-A1X3APTdNuliAS9-YjP2_WHb7dmbKcpGnVY7tgce_3tuR3nkPA_RcsbOgtx2BYqdQ5iz9k0RlAfCpwQNS14DOulkF9H8hX58dNboz8NKXoVAwnYT6O7UdTYqUlOAlaFZyK8VYK-oeA8dQIs3AVFznX4o_tk_DhCVVA4x9CAwGgknI99mIELoMqBRloplEK2QYLTiDIkDY"
				/>
			</div>

			<div className="relative z-10 max-w-lg">
				<h1 className="mb-6 font-extrabold font-headline text-5xl text-white leading-none tracking-tighter lg:text-6xl">
					Justicia Soberana
				</h1>

				<p className="font-body text-lg text-white/80 leading-relaxed lg:text-xl">
					El Sistema de Apoyo Judicial proporciona un marco arquitectónico
					seguro para los procedimientos legales modernos. La estabilidad se
					encuentra con la claridad.
				</p>

				<div className="mt-12 flex flex-col gap-6">
					<div className="flex items-start gap-4">
						<span className="rounded-lg bg-white/10 p-2 text-white">
							<ShieldCheck className="size-6" />
						</span>
						<div>
							<h3 className="font-headline font-semibold text-white">
								Seguridad Inmutable
							</h3>
							<p className="text-sm text-white/70">
								Cifrado de extremo a extremo para toda la documentación
								confidencial del caso.
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<span className="rounded-lg bg-white/10 p-2 text-white">
							<Gavel className="size-6" />
						</span>
						<div>
							<h3 className="font-headline font-semibold text-white">
								Libro Mayor Judicial
							</h3>
							<p className="text-sm text-white/70">
								Seguimiento transparente de todas las acciones administrativas
								del tribunal.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
