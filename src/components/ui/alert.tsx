import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full flex items-center gap-3 rounded-lg border px-4 py-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        error: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning: "border-warning/50 bg-warning/10 text-warning dark:border-warning [&>svg]:text-warning",
        success: "border-success/50 bg-success/10 text-success dark:border-success [&>svg]:text-success",
        info: "border-info/50 bg-info/10 text-info dark:border-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  default: Info,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  role?: "alert" | "status" | "log" | string;
  ariaLive?: "assertive" | "polite" | "off";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      icon,
      title,
      description,
      dismissible = true,
      onDismiss,
      role = "alert",
      ariaLive = "polite",
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent =
      variant && iconMap[variant] ? iconMap[variant] : iconMap.default;

    return (
      <div
        ref={ref}
        role={role}
        aria-live={ariaLive}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon !== null && (
          <div className="shrink-0 self-start pt-0.5">
            {icon || <IconComponent className="h-5 w-5" />}
          </div>
        )}

        <div className="flex-1 space-y-1">
          {title && (
            <h5 className="font-medium leading-none tracking-tight">{title}</h5>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {children}
        </div>

        {dismissible && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };
