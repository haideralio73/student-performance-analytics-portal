/**
 * pages/AttendancePage.jsx — Attendance viewing page.
 */

import { useFetch } from '../hooks/useFetch';

const statusStyles = {
  present: 'bg-green-900/50 text-green-300',
  absent: 'bg-red-900/50 text-red-300',
  late: 'bg-amber-900/50 text-amber-300',
  excused: 'bg-blue-900/50 text-blue-300',
};

export default function AttendancePage() {
  const { data, loading } = useFetch('/attendance');
  const records = Array.isArray(data) ? data : [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">
        Attendance
        <span className="ml-2 text-sm font-normal text-gray-400">({records.length} records)</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-sm">No attendance records found.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Subject</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-white text-xs font-mono">
                    {r.date ? new Date(r.date).toLocaleDateString() : '---'}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{r.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[r.status] || statusStyles.present}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {r.markedBy?.name || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
