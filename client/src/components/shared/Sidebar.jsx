/**
 * components/shared/Sidebar.jsx — Left-hand navigation menu.
 *
 * Displays navigation links filtered by the current user's role
 * and highlights the active route.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS } from '../../utils/constants';

export default function Sidebar() {
  const { user } = useAuth();

  const links = NAV_LINKS.filter(
    (link) => !link.roles || link.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 text-lg font-bold border-b">SPPA Portal</div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
