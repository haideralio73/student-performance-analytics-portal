/**
 * pages/UsersPage.jsx — User management (Admin only) with icons.
 */

import { useFetch } from '../hooks/useFetch';
import { IconUsers } from '../components/shared/Icons';

export default function UsersPage() {
  const { data, loading } = useFetch('/users');
  const users = Array.isArray(data) ? data : [];

  const roleStyle = (role) => {
    const s = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      student: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return s[role] || s.student;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <IconUsers className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <p className="text-xs text-gray-500">{users.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4 font-medium">Name</th>
                <th className="text-left px-5 py-4 font-medium">Email</th>
                <th className="text-left px-5 py-4 font-medium">Role</th>
                <th className="text-left px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">{u.name}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg border capitalize ${roleStyle(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-16 text-center text-gray-600 text-sm">No users registered yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
