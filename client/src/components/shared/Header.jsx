/**
 * components/shared/Header.jsx — Top header bar.
 *
 * Shows the current page title, role badge, and user avatar.
 */

import { useAuth } from '../../hooks/useAuth';

const roleBadge = {
  admin: 'bg-red-100 text-red-800',
  teacher: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
};

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">
        {user?.role === 'admin'
          ? 'Administration'
          : user?.role === 'teacher'
          ? 'Instructor Portal'
          : 'Student Portal'}
      </h1>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
            roleBadge[user?.role] || roleBadge.student
          }`}
        >
          {user?.role}
        </span>

        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
          {user?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?'}
        </div>
      </div>
    </header>
  );
}
