/**
 * pages/SettingsPage.jsx — Settings page placeholder.
 */

import { useAuth } from '../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <div className="text-white">{user?.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="text-white">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <div className="text-white capitalize">{user?.role}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
            <div className="text-white text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
