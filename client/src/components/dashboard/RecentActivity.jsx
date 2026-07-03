/**
 * components/dashboard/RecentActivity.jsx — Recent activity feed.
 *
 * Shows a timeline of the latest grade entries, attendance
 * marks, and other notable events.
 */

export default function RecentActivity({ activities = [] }) {
  if (!activities.length) {
    return <p className="text-gray-500 text-sm">No recent activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity, i) => (
        <li key={i} className="flex items-start gap-3 bg-white rounded-lg shadow p-4">
          <span className="text-lg">{activity.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-800">{activity.message}</p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
