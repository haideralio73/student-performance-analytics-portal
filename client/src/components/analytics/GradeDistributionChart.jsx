/**
 * components/analytics/GradeDistributionChart.jsx — Grade distribution bar chart.
 * Shows A/B/C/D/F count across all assessments.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GRADE_COLORS = { A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

export default function GradeDistributionChart({ grades = [] }) {
  if (!grades.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No grade data
      </div>
    );
  }

  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach((g) => {
    const pct = (g.score / g.maxScore) * 100;
    if (pct >= 90) dist.A++;
    else if (pct >= 80) dist.B++;
    else if (pct >= 70) dist.C++;
    else if (pct >= 60) dist.D++;
    else dist.F++;
  });

  const data = Object.entries(dist).map(([letter, count]) => ({ letter, count }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis dataKey="letter" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(55,65,81,0.2)' }}
          contentStyle={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
          labelStyle={{ color: '#d1d5db', fontWeight: 600, fontSize: 13, marginBottom: 4 }}
          itemStyle={{ color: '#e5e7eb', fontSize: 12, padding: '2px 0' }}
          formatter={(value, name) => [`${value} assessments`, `Grade ${name}`]}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={GRADE_COLORS[entry.letter] || '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
