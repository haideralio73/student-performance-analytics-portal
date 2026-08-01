/**
 * pages/GradesPage.jsx — Grade records with full CRUD for admin/teacher.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { IconGrades, IconPlus, IconPencil, IconTrash, IconX } from '../components/shared/Icons';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useState } from 'react';

export default function GradesPage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useFetch('/grades');
  const grades = Array.isArray(data) ? data : [];
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ student: '', subject: '', assessmentName: '', assessmentType: 'exam', score: '', maxScore: 100, term: '', date: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ student: '', subject: '', assessmentName: '', assessmentType: 'exam', score: '', maxScore: 100, term: '', date: '' });
    setShowModal(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    setForm({
      student: g.student?._id || g.student || '',
      subject: g.subject || '',
      assessmentName: g.assessmentName || '',
      assessmentType: g.assessmentType || 'exam',
      score: g.score,
      maxScore: g.maxScore,
      term: g.term || '',
      date: g.date ? new Date(g.date).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/grades/${editing._id}`, form);
        toast.success('Grade updated');
      } else {
        await api.post('/grades', form);
        toast.success('Grade recorded');
      }
      setShowModal(false); refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this grade permanently?')) return;
    try { await api.delete(`/grades/${id}`); toast.success('Grade deleted'); refetch(); }
    catch { toast.error('Delete failed'); }
  };

  const exportCSV = async () => {
    try {
      const res = await api.get('/export/grades/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url;
      link.setAttribute('download', `grades-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url); toast.success('CSV downloaded');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <IconGrades className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.role === 'student' ? 'My Grades' : 'Grade Records'}</h2>
            <p className="text-xs text-gray-500">{grades.length} assessments</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl">Export CSV</button>
          {canEdit && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20">
              <IconPlus className="w-4 h-4" /> Record Grade
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : grades.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800/80">
          <IconGrades className="w-14 h-14 text-gray-800 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-1">No grades yet</h3>
          <p className="text-gray-500 text-sm mb-4">Assessment records will appear here once submitted.</p>
          {canEdit && <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl"><IconPlus className="w-4 h-4" /> Record Grade</button>}
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
                <th className="text-left px-6 py-4 font-medium">Date</th>
                {canEdit && <th className="text-right px-6 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {grades.map((g) => (
                <tr key={g._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{g.subject}</td>
                  <td className="px-6 py-4 text-gray-400">{g.assessmentName || g.assessmentType}</td>
                  <td className="px-6 py-4"><span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-gray-800 text-gray-300 capitalize">{g.assessmentType}</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-white font-bold">{g.score}</span><span className="text-gray-600">/{g.maxScore}</span><span className="text-xs text-gray-500 ml-1.5">({Math.round((g.score / g.maxScore) * 100)}%)</span></td>
                  <td className="px-6 py-4 text-gray-400">{g.term}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '---'}</td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(g)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-400" title="Edit"><IconPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(g._id)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-red-400" title="Delete"><IconTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-800/50 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Grade' : 'Record Grade'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white"><IconX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Student ID</label>
                <input type="text" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required placeholder="ObjectId" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Data Structures" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Assessment Name</label>
                <input type="text" value={form.assessmentName} onChange={(e) => setForm({ ...form, assessmentName: e.target.value })} placeholder="Midterm Exam" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                  <select value={form.assessmentType} onChange={(e) => setForm({ ...form, assessmentType: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="exam">Exam</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option><option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Term</label>
                  <input type="text" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} required placeholder="Spring 2026" className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Score</label>
                  <input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} required min={0} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Score</label>
                  <input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })} required min={1} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm">{submitting ? 'Saving...' : editing ? 'Update Grade' : 'Record Grade'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-sm border border-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
