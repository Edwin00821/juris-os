"use client";

import { Toaster } from "@juris-os/ui/components/sonner";
import dynamic from "next/dynamic";
import { NuqsProvider } from "./nuqs";
import { ReactQueryProvider } from "./react-query";
import { ThemeProvider } from "./theme-provider";

const TanStackGlobalDevtools =
	process.env.NODE_ENV === "production"
		? () => null
		: dynamic(
				() =>
					Promise.all([
						import("@tanstack/react-devtools"),
						import("@tanstack/react-form-devtools"),
					]).then(([devtoolsMod, formPluginMod]) => {
						return function DevtoolsWrapper() {
							return (
								<devtoolsMod.TanStackDevtools
									plugins={[formPluginMod.formDevtoolsPlugin()]}
									eventBusConfig={{ debug: true }}
								/>
							);
						};
					}),
				{ ssr: false },
			);

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			<ReactQueryProvider>
				<NuqsProvider>{children}</NuqsProvider>

				<Toaster position="top-center" theme="light" richColors />

				<TanStackGlobalDevtools />
			</ReactQueryProvider>
		</ThemeProvider>
	);
}
