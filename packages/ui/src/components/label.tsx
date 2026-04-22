import { cn } from "@juris-os-/ui/lib/utils";
import type * as React from "react";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: This is a base UI component; the control association (htmlFor) is handled dynamically by the consumer.
    <label
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 font-bold font-sans text-muted-foreground text-xs uppercase leading-none tracking-widest peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
