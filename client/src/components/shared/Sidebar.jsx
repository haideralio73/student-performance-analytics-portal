/**
 * components/shared/Sidebar.jsx — Left-hand navigation menu with SVG icons.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Logo,
  IconDashboard,
  IconStudents,
  IconGrades,
  IconAttendance,
  IconAnalytics,
  IconUsers,
  IconSettings,
  IconLogout,
} from './Icons';

const navGroups = {
  student: [
    { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
    { to: '/grades', label: 'My Grades', icon: IconGrades },
    { to: '/attendance', label: 'Attendance', icon: IconAttendance },
    { to: '/analytics', label: 'My Reports', icon: IconAnalytics },
  ],
  teacher: [
    { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
    { to: '/students', label: 'Students', icon: IconStudents },
    { to: '/grades', label: 'Grades', icon: IconGrades },
    { to: '/attendance', label: 'Attendance', icon: IconAttendance },
    { to: '/analytics', label: 'Analytics', icon: IconAnalytics },
  ],
  admin: [
    { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
    { to: '/users', label: 'Users', icon: IconUsers },
    { to: '/students', label: 'Students', icon: IconStudents },
    { to: '/grades', label: 'Grades', icon: IconGrades },
    { to: '/attendance', label: 'Attendance', icon: IconAttendance },
    { to: '/analytics', label: 'Reports', icon: IconAnalytics },
  ],
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = navGroups[user?.role] || navGroups.student;

  return (
    <aside className="w-64 bg-gray-950 flex flex-col flex-shrink-0 border-r border-gray-800/50">
      {/* Logo area */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-800/50">
        <Logo className="w-9 h-9" />
        <div>
          <div className="text-white font-semibold text-sm leading-tight">SPAP</div>
          <div className="text-gray-500 text-[10px] leading-tight">Performance Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-gray-800/50">
        <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent transition-all duration-150 mb-1">
          <IconSettings className="w-5 h-5 flex-shrink-0" />
          Settings
        </NavLink>

        <div className="mt-3 px-3 py-2.5 bg-gray-900 rounded-xl border border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-white font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-600/10 hover:text-red-400 border border-transparent transition-all duration-150"
        >
          <IconLogout className="w-5 h-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
