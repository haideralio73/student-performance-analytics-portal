/**
 * pages/AnalyticsPage.jsx — Analytics & reports page.
 *
 * Renders chart components for grade distribution,
 * attendance trends, and individual performance comparisons.
 */

import GradeDistributionChart from '../components/analytics/GradeDistributionChart';
import AttendanceTrendChart from '../components/analytics/AttendanceTrendChart';
import StudentPerformanceChart from '../components/analytics/StudentPerformanceChart';
import { useFetch } from '../hooks/useFetch';

export default function AnalyticsPage() {
  const { data } = useFetch('/analytics/class-overview');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeDistributionChart distribution={data?.gradeDistribution} />
        <AttendanceTrendChart data={[]} />
      </div>
      <StudentPerformanceChart data={[]} />
    </div>
  );
}
