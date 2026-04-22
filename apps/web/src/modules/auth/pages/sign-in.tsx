"use client";

import { useState } from "react";
import { AuthErrorAlert } from "../components/auth-error-alert";
import { AuthTabs } from "../components/auth-tabs";
import { SignInForm } from "../components/sign-in-form";
import { StatusBanner } from "../components/status-banner";

export function SignInPage() {
  const [hasError, _setHasError] = useState(true);
  const [isPending, _setIsPending] = useState(true);
  return (
    <>
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-lg">
        <AuthTabs />

        {hasError && <AuthErrorAlert />}

        <SignInForm />
      </div>

      {isPending && <StatusBanner />}
    </>
  );
}
