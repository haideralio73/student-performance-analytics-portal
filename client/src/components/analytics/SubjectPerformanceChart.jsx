/**
 * components/analytics/SubjectPerformanceChart.jsx — Per-subject average bar chart.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function SubjectPerformanceChart({ grades = [] }) {
  if (!grades.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No data
      </div>
    );
  }

  const subjects = {};
  grades.forEach((g) => {
    if (!subjects[g.subject]) subjects[g.subject] = { total: 0, count: 0 };
    subjects[g.subject].total += (g.score / g.maxScore) * 100;
    subjects[g.subject].count++;
  });

  const data = Object.entries(subjects).map(([subject, val]) => ({
    subject,
    average: Math.round((val.total / val.count) * 10) / 10,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6', fontSize: '12px' }}
          formatter={(value) => [`${value}%`, 'Average']}
        />
        <Bar dataKey="average" radius={[0, 6, 6, 0]} barSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
