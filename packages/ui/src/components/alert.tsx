import { cn } from "@juris-os-/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const alertVariants = cva(
  "group/alert relative grid w-full items-center gap-2 rounded-lg border px-4 py-4 text-left font-body text-sm has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-action]:pr-18 *:[svg:not([class*='size-'])]:size-5 *:[svg]:row-span-2 *:[svg]:translate-y-0 *:[svg]:text-current",
  {
    variants: {
      variant: {
        default:
          "border-outline-variant/30 bg-surface-container-lowest text-on-surface shadow-[0_8px_24px_-8px_rgba(0,32,69,0.08)]",
        destructive:
          "border-none bg-error-container text-on-error-container *:data-[slot=alert-description]:text-on-error-container/80 *:[svg]:text-on-error-container",
        info: "rounded-lg border-y-0 border-r-0 border-l-4 border-l-primary bg-surface-container-low p-6 shadow-none has-[>svg]:gap-x-4 *:[svg:not([class*='size-'])]:size-6",
        warning:
          "rounded-lg border-l-4 border-l-tertiary border-none bg-tertiary-container/40 text-on-surface *:[svg]:text-tertiary",
        success:
          "rounded-lg border-l-4 border-l-primary border-none bg-primary-fixed text-on-primary-fixed *:[svg]:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-bold font-headline text-sm uppercase tracking-wide group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-primary",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-balance text-sm/relaxed group-has-[>svg]/alert:col-start-2 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-primary [&_p:not(:last-child)]:mb-2",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "absolute top-[calc(--spacing(1.25))] right-[calc(--spacing(1.25))]",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
