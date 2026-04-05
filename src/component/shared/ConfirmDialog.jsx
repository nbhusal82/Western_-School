import React from "react";
import { Trash2 } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  variant = "delete", // "delete" | "logout"
}) => {
  if (!isOpen) return null;

  const isLogout = variant === "logout";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: isLogout
                ? "color-mix(in srgb, var(--color-secondary) 15%, white)"
                : "#fee2e2",
            }}
          >
            <Trash2
              size={22}
              style={{ color: isLogout ? "var(--color-secondary)" : "#ef4444" }}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title || "Delete?"}
            </h3>
            <p className="text-gray-600 text-sm">
              {message || "Are you sure? This action cannot be undone."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 text-white"
            style={{ backgroundColor: isLogout ? "var(--color-secondary)" : "#ef4444" }}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {isLogout ? "Sign Out" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
