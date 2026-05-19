import { guardGuest } from "@/lib/auth-guard";

import { AssistantWidget } from "@/modules/iam/components/assistant-widget";
import { AuthFooter } from "@/modules/iam/components/auth-footer";
import { HeroSection } from "@/modules/iam/components/hero-section";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await guardGuest();

	return (
		<div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
			<main className="flex min-h-screen grow flex-col md:flex-row">
				<HeroSection />

				<section className="flex w-full flex-col items-center justify-center bg-surface-bright p-6 md:w-1/2 md:p-12 lg:p-24">
					<div className="w-full max-w-md space-y-8">
						{children}

						<AuthFooter />
					</div>
				</section>
			</main>

			<AssistantWidget />
		</div>
	);
}
