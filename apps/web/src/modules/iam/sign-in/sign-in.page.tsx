"use client";

import { AuthTabs } from "../components/auth-tabs";
import { SignInForm } from "./sign-in.form";

export function SignInPage() {
	return (
		<div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-lg">
			<AuthTabs />
			<SignInForm />
		</div>
	);
}
