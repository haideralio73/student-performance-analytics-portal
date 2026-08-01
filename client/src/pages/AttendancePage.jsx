/**
 * pages/AttendancePage.jsx — Attendance records with mark/edit for admin/teacher.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { IconAttendance, IconPlus, IconPencil, IconX } from '../components/shared/Icons';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useState } from 'react';

const statusStyle = {
  present: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  absent: 'bg-red-500/10 text-red-400 border-red-500/20',
  late: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  excused: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function AttendancePage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useFetch('/attendance');
  const records = Array.isArray(data) ? data : [];
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ student: '', subject: '', date: '', status: 'present' });

  const openCreate = () => {
    setEditing(null);
    setForm({ student: '', subject: '', date: '', status: 'present' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      student: r.student?._id || r.student || '',
      subject: r.subject || '',
      date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
      status: r.status || 'present',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/attendance/${editing._id}`, form);
        toast.success('Attendance updated');
      } else {
        await api.post('/attendance', form);
        toast.success('Attendance marked');
      }
      setShowModal(false); refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const exportCSV = async () => {
    try {
      const res = await api.get('/export/attendance/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url;
      link.setAttribute('download', `attendance-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url); toast.success('CSV downloaded');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 flex items-center justify-center">
            <IconAttendance className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.role === 'student' ? 'My Attendance' : 'Attendance Records'}</h2>
            <p className="text-xs text-gray-500">{records.length} records</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl">Export CSV</button>
          {canEdit && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20">
              <IconPlus className="w-4 h-4" /> Mark Attendance
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800/80">
          <IconAttendance className="w-14 h-14 text-gray-800 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-1">No attendance records</h3>
          <p className="text-gray-500 text-sm mb-4">Attendance data will appear once teachers begin marking sessions.</p>
          {canEdit && <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl"><IconPlus className="w-4 h-4" /> Mark Attendance</button>}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-950/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Subject</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Student ID</th>
                <th className="text-right px-6 py-4 font-medium">Marked By</th>
                {canEdit && <th className="text-right px-6 py-4 font-medium">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-white font-mono text-xs">{r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</td>
                  <td className="px-6 py-4 text-gray-400">{r.subject}</td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize ${statusStyle[r.status] || statusStyle.present}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-mono">{r.student?._id || r.student || '---'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs text-right">{r.markedBy?.name || '---'}</td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(r)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-400" title="Edit"><IconPencil className="w-4 h-4" /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-800/50 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Attendance' : 'Mark Attendance'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white"><IconX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Student ID</label>
                <input type="text" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required placeholder="ObjectId" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Data Structures" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                <div className="relative">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm">{submitting ? 'Saving...' : editing ? 'Update' : 'Mark Attendance'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-sm border border-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
