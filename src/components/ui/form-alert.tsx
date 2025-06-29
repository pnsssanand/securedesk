import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertProps } from './alert';

interface FormAlertProps extends Omit<AlertProps, 'variant'> {
  error?: string;
}

export function FormAlert({ error, className, ...props }: FormAlertProps) {
  if (!error) return null;
  
  return (
    <Alert
      variant="error"
      icon={<AlertCircle className="h-4 w-4" />}
      className={cn(
        "mt-2 py-2 px-3 text-sm border-destructive/30 bg-destructive/10 text-destructive",
        className
      )}
      role="alert"
      aria-live="assertive"
      dismissible={false}
      {...props}
    >
      <div className="text-xs font-medium">{error}</div>
    </Alert>
  );
}
