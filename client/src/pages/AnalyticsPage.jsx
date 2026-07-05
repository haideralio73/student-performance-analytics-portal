/**
 * pages/AnalyticsPage.jsx — Analytics and reports page.
 */

import { useAuth } from '../hooks/useAuth';
import { IconAnalytics } from '../components/shared/Icons';

export default function AnalyticsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <IconAnalytics className="w-5.5 h-5.5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user?.role === 'admin' ? 'System Reports' : user?.role === 'teacher' ? 'Course Analytics' : 'My Reports'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Performance data and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'Grade Distribution', desc: 'A / B / C / D / F breakdown', accent: 'border-t-blue-600' },
          { title: 'Attendance Trend', desc: 'Weekly attendance percentage', accent: 'border-t-emerald-600' },
          { title: 'Performance by Subject', desc: 'Average scores across courses', accent: 'border-t-purple-600' },
          { title: 'Assessment Breakdown', desc: 'Exam / Quiz / Assignment / Project', accent: 'border-t-amber-600' },
        ].map((c) => (
          <div key={c.title} className={`bg-gray-900 rounded-2xl border border-gray-800/80 border-t-4 ${c.accent} p-6`}>
            <h3 className="text-sm font-semibold text-white mb-1">{c.title}</h3>
            <p className="text-xs text-gray-500 mb-6">{c.desc}</p>
            <div className="h-56 bg-gradient-to-b from-gray-800/40 to-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
              <span className="text-gray-600 text-sm">Chart visualization</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
