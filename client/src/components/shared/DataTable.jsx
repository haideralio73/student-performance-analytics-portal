/**
 * components/shared/DataTable.jsx — Reusable data table component.
 *
 * Accepts column definitions and row data, renders a styled
 * HTML table with optional loading and empty states.
 */

export default function DataTable({ columns, data, loading, emptyMessage = 'No records found.' }) {
  if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  if (!data?.length) return <div className="py-8 text-center text-gray-500">{emptyMessage}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={row._id || i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
