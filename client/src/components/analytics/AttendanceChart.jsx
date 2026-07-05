/**
 * components/analytics/AttendanceChart.jsx — Attendance breakdown donut/bar chart.
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = { present: '#10b981', absent: '#ef4444', late: '#f59e0b', excused: '#3b82f6' };
const LABELS = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused' };

export default function AttendanceChart({ records = [] }) {
  if (!records.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No attendance data
      </div>
    );
  }

  const counts = { present: 0, absent: 0, late: 0, excused: 0 };
  records.forEach((r) => { if (counts[r.status] !== undefined) counts[r.status]++; });

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: LABELS[key] || key, value, color: COLORS[key] }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6', fontSize: '12px' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
