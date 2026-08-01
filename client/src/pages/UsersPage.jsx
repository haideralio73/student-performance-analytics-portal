/**
 * pages/UsersPage.jsx — User management (Admin only) with delete.
 */

import { useFetch } from '../hooks/useFetch';
import { IconUsers, IconTrash } from '../components/shared/Icons';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function UsersPage() {
  const { data, loading, refetch } = useFetch('/users');
  const users = Array.isArray(data) ? data : [];

  const exportCSV = async () => {
    try {
      const r = await api.get('/export/users/csv', { responseType: 'blob' });
      const u = window.URL.createObjectURL(new Blob([r.data]));
      const l = document.createElement('a'); l.href = u; l.setAttribute('download', 'users.csv');
      document.body.appendChild(l); l.click(); l.remove(); window.URL.revokeObjectURL(u);
      toast.success('CSV downloaded');
    } catch { toast.error('Export failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try { await api.delete(`/users/${id}`); toast.success('User removed'); refetch(); }
    catch { toast.error('Delete failed'); }
  };

  const roleBadge = (role) => {
    const s = { admin: 'bg-red-500/10 text-red-400 border-red-500/20', teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20', student: 'bg-green-500/10 text-green-400 border-green-500/20' };
    return s[role] || s.student;
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <IconUsers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">User Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">{users.length} registered users</p>
          </div>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800/80 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{adminCount}</div>
          <div className="text-xs text-gray-500 mt-1">Admins</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800/80 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{teacherCount}</div>
          <div className="text-xs text-gray-500 mt-1">Teachers</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800/80 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{studentCount}</div>
          <div className="text-xs text-gray-500 mt-1">Students</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-950/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Email</th>
                <th className="text-left px-6 py-4 font-medium">Role</th>
                <th className="text-left px-6 py-4 font-medium">Joined</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{u.email}</td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize ${roleBadge(u.role)}`}>{u.role}</span></td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(u._id || u.id, u.name)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-500 hover:text-red-400" title="Delete user">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-600 text-sm">No users registered yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
