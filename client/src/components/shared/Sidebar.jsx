/**
 * components/shared/Sidebar.jsx — Left-hand navigation menu.
 *
 * Displays navigation links filtered by the current user's role
 * and highlights the active route. Logout action at bottom.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navGroups = {
  student: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/grades', label: 'My Grades' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/analytics', label: 'My Reports' },
  ],
  teacher: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/students', label: 'Students' },
    { to: '/grades', label: 'Grades' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/analytics', label: 'Analytics' },
  ],
  admin: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/users', label: 'Users' },
    { to: '/students', label: 'Students' },
    { to: '/grades', label: 'Grades' },
    { to: '/analytics', label: 'System Reports' },
  ],
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-800 text-white'
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = navGroups[user?.role] || navGroups.student;

  return (
    <aside className="w-64 bg-gray-900 flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          SP
        </div>
        <span className="ml-3 text-white font-semibold text-sm">SPAP Portal</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
          {user?.name}
          <span className="block text-gray-600 normal-case tracking-normal mt-0.5 capitalize">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full mt-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-left transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
