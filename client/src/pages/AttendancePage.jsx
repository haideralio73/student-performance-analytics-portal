/**
 * pages/AttendancePage.jsx — Attendance records with role-based display.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { IconAttendance } from '../components/shared/Icons';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusStyle = {
  present: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  absent: 'bg-red-500/10 text-red-400 border-red-500/20',
  late: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  excused: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function AttendancePage() {
  const { user } = useAuth();
  const { data, loading } = useFetch('/attendance');
  const records = Array.isArray(data) ? data : [];

  const exportCSV = async () => {
    try {
      const res = await api.get('/export/attendance/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-600/20 flex items-center justify-center">
          <IconAttendance className="w-5.5 h-5.5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user?.role === 'student' ? 'My Attendance' : 'Attendance Records'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{records.length} records</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800/80">
          <IconAttendance className="w-14 h-14 text-gray-800 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-1">No attendance records</h3>
          <p className="text-gray-500 text-sm">Attendance data will appear once teachers begin marking sessions.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-950/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Subject</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-xs">{r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</td>
                  <td className="px-6 py-4 text-gray-400">{r.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize ${statusStyle[r.status] || statusStyle.present}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs text-right">{r.markedBy?.name || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
