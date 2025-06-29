import * as React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alertBannerVariants = cva(
  "w-full flex items-center gap-3 p-4 border-l-4",
  {
    variants: {
      variant: {
        error: "border-l-destructive bg-destructive/10 text-destructive",
        warning: "border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400",
        success: "border-l-green-600 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400",
        info: "border-l-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof alertBannerVariants> {
  title?: string;
  message: React.ReactNode;
  dismissible?: boolean;
  autoDismiss?: number; // in milliseconds, 0 means no auto-dismiss
}

export function AlertBanner({
  variant = "info",
  title,
  message,
  dismissible = true,
  autoDismiss = 0,
  className,
  ...props
}: AlertBannerProps) {
  const [visible, setVisible] = React.useState(true);
  const IconComponent = variant && iconMap[variant] ? iconMap[variant] : iconMap.info;

  React.useEffect(() => {
    if (autoDismiss && autoDismiss > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoDismiss);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

  if (!visible) return null;

  return (
    <div
      className={cn(alertBannerVariants({ variant }), className)}
      role="alert"
      aria-live={variant === 'error' ? "assertive" : "polite"}
      {...props}
    >
      <IconComponent className="h-5 w-5 shrink-0" />
      
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div className={title ? "text-sm opacity-90" : ""}>{message}</div>
      </div>
      
      {dismissible && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}