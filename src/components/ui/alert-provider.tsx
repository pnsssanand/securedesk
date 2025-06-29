import * as React from 'react';
import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from './alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

type AlertAction =
  | { type: 'ADD_ALERT'; payload: AlertMessage }
  | { type: 'REMOVE_ALERT'; payload: { id: string } };

interface AlertContextType {
  alerts: AlertMessage[];
  showAlert: (
    type: AlertType,
    title: string, 
    message: string, 
    duration?: number,
    dismissible?: boolean
  ) => void;
  dismissAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

function alertReducer(state: AlertMessage[], action: AlertAction): AlertMessage[] {
  switch (action.type) {
    case 'ADD_ALERT':
      return [...state, action.payload];
    case 'REMOVE_ALERT':
      return state.filter((alert) => alert.id !== action.payload.id);
    default:
      return state;
  }
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, dispatch] = useReducer(alertReducer, []);

  const showAlert = useCallback(
    (type: AlertType, title: string, message: string, duration = 5000, dismissible = true) => {
      const id = uuidv4();
      const alert = { id, type, title, message, duration, dismissible };

      dispatch({ type: 'ADD_ALERT', payload: alert });

      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_ALERT', payload: { id } });
        }, duration);
      }
    },
    []
  );

  const dismissAlert = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: { id } });
  }, []);

  const contextValue = { alerts, showAlert, dismissAlert };

  // Find the first error alert to display as a modal
  const errorAlert = alerts.find(a => a.type === 'error');
  // Filter for non-error alerts to display as toasts
  const toastAlerts = alerts.filter(a => a.type !== 'error');

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {/* Toasts for non-error alerts */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-3 pointer-events-none">
        {toastAlerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <Alert
              variant={alert.type}
              title={alert.title}
              description={alert.message}
              dismissible={alert.dismissible}
              onDismiss={() => dismissAlert(alert.id)}
              role="alert"
              aria-live="polite" // Non-error alerts are polite
            />
          </div>
        ))}
      </div>

      {/* Modal for the first error alert */}
      {errorAlert && (
        <AlertDialog open={!!errorAlert} onOpenChange={(isOpen) => !isOpen && dismissAlert(errorAlert.id)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{errorAlert.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {errorAlert.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => dismissAlert(errorAlert.id)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
