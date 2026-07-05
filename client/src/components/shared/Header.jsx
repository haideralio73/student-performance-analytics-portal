/**
 * components/shared/Header.jsx — Top header bar with role badge.
 */

import { useAuth } from '../../hooks/useAuth';

const roleBadge = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  student: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const titles = {
  admin: 'Administration',
  teacher: 'Instructor Portal',
  student: 'Student Portal',
};

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-gray-950 border-b border-gray-800/50 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-lg font-semibold text-white tracking-tight">
        {titles[user?.role] || 'Dashboard'}
      </h1>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border capitalize ${roleBadge[user?.role] || roleBadge.student}`}>
          {user?.role}
        </span>
      </div>
    </header>
  );
}
