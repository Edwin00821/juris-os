import { AlertCircle } from "lucide-react";

interface AuthErrorAlertProps {
  message?: string;
}

export function AuthErrorAlert({
  message = "Credenciales inválidas. Por favor, verifique su ID de funcionario.",
}: AuthErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-8 flex items-center gap-3 rounded-lg bg-error-container p-4 text-error-container-foreground text-on-error-container">
      <AlertCircle className="size-4 shrink-0" />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
}
