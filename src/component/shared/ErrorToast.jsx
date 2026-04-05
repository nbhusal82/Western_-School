import React from "react";
import { AlertCircle, X } from "lucide-react";

const ErrorToast = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-red-500 p-3 sm:p-4 flex items-start gap-2 sm:gap-3 max-w-md mx-auto sm:mx-0">
        <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="text-red-600" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Login Failed</h3>
          <p className="text-[11px] sm:text-xs text-gray-600 mt-1 break-words">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
