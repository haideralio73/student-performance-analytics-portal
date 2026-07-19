/**
 * pages/GradesPage.jsx — Grades list with role-appropriate data.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { IconGrades } from '../components/shared/Icons';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function GradesPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch('/grades');
  const grades = Array.isArray(data) ? data : [];

  const exportCSV = async () => {
    try {
      const res = await api.get('/export/grades/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <IconGrades className="w-5.5 h-5.5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user?.role === 'student' ? 'My Grades' : 'Grade Records'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{grades.length} assessments recorded</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : grades.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800/80">
          <IconGrades className="w-14 h-14 text-gray-800 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-1">No grades yet</h3>
          <p className="text-gray-500 text-sm">Assessment records will appear here once teachers submit grades.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-950/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Subject</th>
                <th className="text-left px-6 py-4 font-medium">Assessment</th>
                <th className="text-left px-6 py-4 font-medium">Type</th>
                <th className="text-center px-6 py-4 font-medium">Score</th>
                <th className="text-left px-6 py-4 font-medium">Term</th>
                <th className="text-right px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {grades.map((g) => (
                <tr key={g._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{g.subject}</td>
                  <td className="px-6 py-4 text-gray-400">{g.assessmentName || g.assessmentType}</td>
                  <td className="px-6 py-4"><span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-gray-800 text-gray-300 capitalize">{g.assessmentType}</span></td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white font-bold">{g.score}</span>
                    <span className="text-gray-600">/{g.maxScore}</span>
                    <span className="text-xs text-gray-500 ml-1.5">({Math.round((g.score / g.maxScore) * 100)}%)</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{g.term}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs text-right">{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
