/**
 * pages/SettingsPage.jsx — User profile and settings.
 */

import { useAuth } from '../hooks/useAuth';
import { IconSettings, IconUser, IconMail, IconShield } from '../components/shared/Icons';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center">
          <IconSettings className="w-5.5 h-5.5 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Account and profile information</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800/50">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <IconUser className="w-4 h-4 text-gray-400" /> Profile
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Name</span>
            <span className="text-sm text-white font-medium">{user?.name || '---'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-sm text-white font-medium flex items-center gap-2">
              <IconMail className="w-4 h-4 text-gray-500" />{user?.email || '---'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Role</span>
            <span className="text-sm text-white font-medium capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800/50">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <IconShield className="w-4 h-4 text-gray-400" /> Security
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Password</span>
            <span className="text-sm text-gray-600">********</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Member since</span>
            <span className="text-sm text-white font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
