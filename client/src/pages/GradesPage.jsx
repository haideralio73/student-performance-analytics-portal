/**
 * pages/GradesPage.jsx — Grade viewing page.
 */

import { useFetch } from '../hooks/useFetch';

export default function GradesPage() {
  const { data, loading } = useFetch('/grades');
  const grades = Array.isArray(data) ? data : [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">
        Grades
        <span className="ml-2 text-sm font-normal text-gray-400">({grades.length} records)</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : grades.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-sm">No grade records found.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Subject</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Score</th>
                <th className="text-left px-5 py-3 font-medium">Term</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {grades.map((g) => (
                <tr key={g._id} className="hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-white font-medium">{g.subject}</td>
                  <td className="px-5 py-3 text-gray-400 capitalize">{g.assessmentType}</td>
                  <td className="px-5 py-3">
                    <span className="text-white font-semibold">{g.score}</span>
                    <span className="text-gray-500">/{g.maxScore}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{g.term}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
