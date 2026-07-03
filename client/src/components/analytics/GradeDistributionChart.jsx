/**
 * components/analytics/GradeDistributionChart.jsx — Grade distribution pie chart.
 *
 * Uses Recharts to render a pie chart showing the breakdown
 * of grades (A/B/C/D/F) across all or filtered assessments.
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];
const LABELS = ['A', 'B', 'C', 'D', 'F'];

export default function GradeDistributionChart({ distribution }) {
  const data = distribution
    ? Object.entries(distribution).map(([key, value]) => ({ name: key, value }))
    : LABELS.map((label) => ({ name: label, value: 0 }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Grade Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
