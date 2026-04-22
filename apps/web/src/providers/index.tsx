"use client";

import { Toaster } from "@juris-os-/ui/components/sonner";

import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
}
