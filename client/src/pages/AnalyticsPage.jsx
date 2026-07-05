/**
 * pages/AnalyticsPage.jsx — Analytics & reports page.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch('/analytics/class-overview');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">
        {user?.role === 'admin' ? 'System Analytics' : 'Performance Analytics'}
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Grade Distribution</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[ Chart: Grade distribution by letter ]</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Attendance Trend</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[ Chart: Attendance over time ]</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Performance by Subject</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[ Chart: Average scores per subject ]</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Assessment Breakdown</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[ Chart: Exam / Quiz / Assignment / Project ]</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
