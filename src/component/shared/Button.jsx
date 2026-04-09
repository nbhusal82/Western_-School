import React from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";


const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  disabled = false,
  isLoading = false,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-semibold ${variants[variant]} ${sizes[size]} ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "active:scale-95"
        } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}

      {children}
    </button>
  );
};


export const AddButton = ({
  onClick,
  label = "Add New",
  isLoading = false,
}) => (
  <Button
    onClick={onClick}

    isLoading={isLoading}
    className="shadow-blue-200"
  >

    {isLoading ? "Adding..." : label}
  </Button>
);


export const ActionButtons = ({ onEdit, onDelete, isDeleting = false }) => (
  <div className="flex items-center gap-2">
    {onEdit && (
      <Button
        onClick={onEdit}
        variant="outline"
        size="sm"
        icon={Pencil}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
      />
    )}
    {onDelete && (
      <Button
        onClick={onDelete}
        variant="outline"
        size="sm"
        icon={Trash2}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        isLoading={isDeleting}
      />
    )}
  </div>
);

// 4. Confirm Dialog Component
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  isLoading = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isLoading ? "bg-gray-100" : "bg-red-50 text-red-500"
            }`}
        >
          {isLoading ? (
            <Loader2 size={32} className="animate-spin text-gray-400" />
          ) : (
            <Trash2 size={32} />
          )}
        </div>
        <h2 className="font-bold text-xl text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm mt-2">{message}</p>
        <div className="flex gap-3 mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="flex-1"
            isLoading={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Button;