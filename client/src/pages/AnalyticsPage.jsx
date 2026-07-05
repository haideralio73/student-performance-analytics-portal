/**
 * pages/AnalyticsPage.jsx — Analytics and reports with real Recharts.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { IconAnalytics } from '../components/shared/Icons';
import GradeDistributionChart from '../components/analytics/GradeDistributionChart';
import SubjectPerformanceChart from '../components/analytics/SubjectPerformanceChart';
import AttendanceChart from '../components/analytics/AttendanceChart';
import GradeTrendChart from '../components/analytics/GradeTrendChart';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { data: grades, loading: gLoad } = useFetch('/grades');
  const { data: attendance, loading: aLoad } = useFetch('/attendance');
  const gradeList = Array.isArray(grades) ? grades : [];
  const attList = Array.isArray(attendance) ? attendance : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <IconAnalytics className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user?.role === 'admin' ? 'System Reports' : user?.role === 'teacher' ? 'Course Analytics' : 'My Reports'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {gLoad ? 'Loading data...' : `${gradeList.length} grades, ${attList.length} attendance records analyzed`}
          </p>
        </div>
      </div>

      {gLoad && aLoad ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 border-t-4 border-t-blue-600">
            <h3 className="text-sm font-semibold text-white mb-1">Grade Distribution</h3>
            <p className="text-xs text-gray-500 mb-6">Assessment results by letter grade</p>
            <div className="h-64"><GradeDistributionChart grades={gradeList} /></div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 border-t-4 border-t-emerald-600">
            <h3 className="text-sm font-semibold text-white mb-1">Attendance Overview</h3>
            <p className="text-xs text-gray-500 mb-6">Present / Absent / Late / Excused</p>
            <div className="h-64"><AttendanceChart records={attList} /></div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 border-t-4 border-t-purple-600">
            <h3 className="text-sm font-semibold text-white mb-1">Subject Performance</h3>
            <p className="text-xs text-gray-500 mb-6">Average scores across courses</p>
            <div className="h-64"><SubjectPerformanceChart grades={gradeList} /></div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 border-t-4 border-t-amber-600">
            <h3 className="text-sm font-semibold text-white mb-1">Score Trend</h3>
            <p className="text-xs text-gray-500 mb-6">Performance over time</p>
            <div className="h-64"><GradeTrendChart grades={gradeList} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
