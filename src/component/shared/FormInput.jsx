import React from "react";

// Text Input Component
export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none text-sm bg-gray-50/50 transition-all ${className}`}
      />
    </div>
  );
};

// Textarea Component
export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = "",
}) => {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none text-sm bg-gray-50/50 transition-all resize-none ${className}`}
      />
    </div>
  );
};

// Select Component
export const FormSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  required = false,
  className = "",
}) => {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none text-sm bg-gray-50/50 transition-all cursor-pointer ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Image Upload with Preview Component
export const FormImageUpload = ({
  label,
  image,
  onImageChange,
  onImageRemove,
  existingImageUrl,
  accept = "image/*",
  hint = "PNG, JPG up to 2MB",
  previewShape = "rounded-xl", // "rounded-xl" or "rounded-full"
  previewSize = "w-20 h-20",
}) => {
  const previewUrl = image
    ? URL.createObjectURL(image)
    : existingImageUrl
    ? existingImageUrl
    : null;

  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {/* Image Preview */}
        {previewUrl && (
          <div
            className={`relative ${previewSize} ${previewShape} border-2 overflow-hidden shadow-sm shrink-0`}
            style={{ borderColor: "var(--color-secondary)" }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all"
            >
              ×
            </button>
          </div>
        )}

        {/* File Input */}
        <div className="flex-1">
          <input
            type="file"
            accept={accept}
            onChange={onImageChange}
            className={`w-full text-xs cursor-pointer transition-all rounded-xl border px-2 py-1
      ${
        image || existingImageUrl
          ? "border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary)_10%,white)]"
          : "border-gray-200"
      }
      file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-1 
      file:text-xs file:font-bold file:bg-[color-mix(in_srgb,var(--color-secondary)_10%,white)] file:text-[var(--color-secondary)] 
      hover:file:bg-[color-mix(in_srgb,var(--color-secondary)_20%,white)]
    `}
          />

          {hint && (
            <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// File Upload with Preview Component (for PDFs, etc)
export const FormFileUpload = ({
  label,
  file,
  onFileChange,
  onFileRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
  hint = "PDF, PNG, JPG up to 10MB",
}) => {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {/* File Preview */}
        {file && (
          <div className="relative px-4 py-2.5 rounded-xl border-2 shrink-0" style={{ borderColor: "var(--color-secondary)", backgroundColor: "color-mix(in srgb, var(--color-secondary) 10%, white)" }}>
            <p className="text-xs font-bold truncate max-w-[120px]" style={{ color: "var(--color-secondary)" }}>
              {file.name}
            </p>
            <button
              type="button"
              onClick={onFileRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all"
            >
              ×
            </button>
          </div>
        )}

        {/* File Input */}
        <div className="flex-1">
          <input
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[color-mix(in_srgb,var(--color-secondary)_10%,white)] file:text-[var(--color-secondary)] hover:file:bg-[color-mix(in_srgb,var(--color-secondary)_20%,white)] cursor-pointer transition-all"
          />
          {hint && (
            <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
};
