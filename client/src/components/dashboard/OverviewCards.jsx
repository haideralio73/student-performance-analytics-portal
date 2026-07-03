/**
 * components/dashboard/OverviewCards.jsx — Dashboard summary cards.
 *
 * Fetches high-level metrics (student count, average score,
 * attendance rate) and renders them as StatCard components.
 */

import StatCard from '../shared/StatCard';
import { useFetch } from '../../hooks/useFetch';

export default function OverviewCards() {
  const { data, loading } = useFetch('/analytics/class-overview');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Students" value={loading ? '...' : data?.totalStudents ?? '—'} icon="🎓" />
      <StatCard label="Avg. Score" value={loading ? '...' : `${data?.averageScore ?? 0}%`} icon="📊" />
      <StatCard label="Attendance Rate" value={loading ? '...' : `${data?.attendanceRate ?? 0}%`} icon="✅" />
      <StatCard label="Assessments" value={loading ? '...' : data?.totalAssessments ?? '—'} icon="📝" />
    </div>
  );
}
