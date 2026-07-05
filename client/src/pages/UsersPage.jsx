/**
 * pages/UsersPage.jsx — User management (Admin only).
 */

import { useFetch } from '../hooks/useFetch';

export default function UsersPage() {
  const { data, loading } = useFetch('/users');
  const users = Array.isArray(data) ? data : [];

  const roleStyle = (role) => {
    const styles = {
      admin: 'bg-red-900/50 text-red-300',
      teacher: 'bg-blue-900/50 text-blue-300',
      student: 'bg-green-900/50 text-green-300',
    };
    return styles[role] || styles.student;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">
        User Management
        <span className="ml-2 text-sm font-normal text-gray-400">({users.length} users)</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleStyle(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    No users registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
