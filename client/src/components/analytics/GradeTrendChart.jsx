/**
 * components/analytics/GradeTrendChart.jsx — Grade trend line chart.
 * Shows score progression over time across all subjects.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GradeTrendChart({ grades = [] }) {
  if (!grades.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No grade data available
      </div>
    );
  }

  const data = grades
    .map((g) => ({
      name: g.assessmentName || g.subject,
      score: Math.round((g.score / g.maxScore) * 100),
      date: g.date || g.createdAt,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6', fontSize: '12px' }}
          formatter={(value) => [`${value}%`, 'Score']}
        />
        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6, fill: '#60a5fa' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
