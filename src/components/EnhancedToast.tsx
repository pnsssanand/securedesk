
import React from 'react';
import { Check, X, AlertTriangle, Info, Shield } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'security';
  title: string;
  message: string;
  onClose: () => void;
}

const EnhancedToast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5" />;
      case 'error': return <X className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-400 text-white';
      case 'error':
        return 'bg-red-500/90 border-red-400 text-white';
      case 'warning':
        return 'bg-yellow-500/90 border-yellow-400 text-white';
      case 'info':
        return 'bg-blue-500/90 border-blue-400 text-white';
      case 'security':
        return 'bg-purple-500/90 border-purple-400 text-white';
      default:
        return 'bg-gray-500/90 border-gray-400 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-up`}>
      <div className={`p-4 rounded-lg border backdrop-blur-lg shadow-2xl ${getStyles()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 animate-bounce">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold">{title}</h4>
            <p className="text-sm opacity-90 mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full animate-shrink"
            style={{ animation: 'shrink 4s linear forwards' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedToast;
