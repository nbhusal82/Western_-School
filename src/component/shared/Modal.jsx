import React from "react";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children, size = "sm" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl w-full ${sizeClasses[size]} shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] sm:max-h-[85vh] flex flex-col`}>
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 rounded-t-2xl" style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--color-background) 30%, white), white)" }}>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700 shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
