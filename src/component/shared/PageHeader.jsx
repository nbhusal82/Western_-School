import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between mb-6 sm:mb-8 gap-3 sm:items-center border-b pb-4" style={{ borderColor: "var(--color-secondary)" }}>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: "var(--color-secondary)" }}>{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2 shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
