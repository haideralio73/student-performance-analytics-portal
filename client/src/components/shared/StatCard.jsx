/**
 * components/shared/StatCard.jsx — Dashboard statistic card.
 *
 * Displays a labeled metric with an icon and optional trend indicator.
 */

export default function StatCard({ label, value, icon, trend, color = 'indigo' }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full bg-${color}-100 text-${color}-600 flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {trend && <p className="text-xs text-green-600">{trend}</p>}
      </div>
    </div>
  );
}
