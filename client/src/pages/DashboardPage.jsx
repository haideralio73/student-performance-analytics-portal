/**
 * pages/DashboardPage.jsx — Main dashboard page.
 *
 * Displays summary stat cards, recent activity feed,
 * and quick-glance charts for the current user's role.
 */

import OverviewCards from '../components/dashboard/OverviewCards';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <div>
      <OverviewCards />
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <RecentActivity />
      </section>
    </div>
  );
}
