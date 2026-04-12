import React from "react";

const Table = ({
  columns,
  data,
  actions,
  emptyMessage = "No data found",
  wrapperClassName = "",
  tableClassName = "",
  headerClassName = "",
  bodyClassName = "",
  rowClassName = "",
}) => {
  return (
    <div
      className={`bg-white shadow-sm border border-gray-200 overflow-x-auto ${wrapperClassName}`}
    >
      <table
        className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}
      >
        <thead className={`bg-gray-100 whitespace-nowrap ${headerClassName}`}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider ${col.headerClassName || col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody
          className={`bg-white divide-y divide-gray-200 whitespace-nowrap ${bodyClassName}`}
        >
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || row._id || rowIndex}
                className={`transition-colors hover:bg-gray-50 ${rowClassName}`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-4 text-sm font-medium text-slate-600 ${col.cellClassName || ""}`}
                  >
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-4 text-sm">
                    {actions(row, rowIndex)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-10 text-center text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
