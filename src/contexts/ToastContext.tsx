
import React, { createContext, useContext, useState, ReactNode } from 'react';
import EnhancedToast from '@/components/EnhancedToast';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'security';
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: Toast['type'], title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showSecurity: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, title, message };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const showSuccess = (title: string, message: string) => showToast('success', title, message);
  const showError = (title: string, message: string) => showToast('error', title, message);
  const showWarning = (title: string, message: string) => showToast('warning', title, message);
  const showInfo = (title: string, message: string) => showToast('info', title, message);
  const showSecurity = (title: string, message: string) => showToast('security', title, message);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showSecurity
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            style={{ transform: `translateY(${index * 70}px)` }}
          >
            <EnhancedToast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
