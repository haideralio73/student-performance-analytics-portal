/**
 * components/shared/Header.jsx — Top header bar.
 *
 * Shows the current page title, user avatar/name, and
 * a logout action.
 */

import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
          {user?.name ? getInitials(user.name) : '?'}
        </div>
        <button onClick={logout} className="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
