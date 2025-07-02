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
        return 'bg-green-500/95 border-green-400 text-white shadow-green-500/25';
      case 'error':
        return 'bg-red-500/95 border-red-400 text-white shadow-red-500/25';
      case 'warning':
        return 'bg-yellow-500/95 border-yellow-400 text-white shadow-yellow-500/25';
      case 'info':
        return 'bg-blue-500/95 border-blue-400 text-white shadow-blue-500/25';
      case 'security':
        return 'bg-purple-500/95 border-purple-400 text-white shadow-purple-500/25';
      default:
        return 'bg-gray-500/95 border-gray-400 text-white shadow-gray-500/25';
    }
  };

  return (
    <div className={`
      relative w-96 max-w-full mx-auto
      p-4 rounded-lg border-2 
      backdrop-blur-md shadow-2xl
      transform transition-all duration-300 ease-out
      ${getStyles()}
    `}>
      <div className="relative flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold mb-1">{title}</h4>
          <p className="text-sm opacity-95">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-white h-full rounded-full"
          style={{ animation: 'shrink 6s linear forwards' }}
        />
      </div>
    </div>
  );
};

export default EnhancedToast
