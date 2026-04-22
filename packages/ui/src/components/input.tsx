import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@juris-os-/ui/lib/utils";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-14 w-full min-w-0 rounded-lg border-x-0 border-t-0 border-b-2 border-b-transparent bg-muted/50 px-4 py-4 font-body text-sm outline-none transition-colors",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
        "placeholder:text-muted-foreground/50",
        "focus-visible:border-b-primary focus-visible:ring-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-b-destructive aria-invalid:ring-0",
        "dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
