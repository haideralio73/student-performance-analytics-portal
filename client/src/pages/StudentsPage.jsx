/**
 * pages/StudentsPage.jsx — Student management with icons.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import { IconPlus, IconPencil, IconTrash, IconX, IconStudents } from '../components/shared/Icons';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    user: '',
    studentId: '',
    programme: '',
    enrollmentYear: new Date().getFullYear(),
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ user: '', studentId: '', programme: '', enrollmentYear: new Date().getFullYear() });
    setShowModal(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      user: student.user?._id || student.user || '',
      studentId: student.studentId || '',
      programme: student.programme || '',
      enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateStudent(editing._id, form);
        toast.success('Student updated');
      } else {
        await createStudent(form);
        toast.success('Student created');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student removed');
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
            <IconStudents className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Students</h2>
            <p className="text-xs text-gray-500">{students.length} total</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
            <IconPlus className="w-4 h-4" /> Add Student
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20">
          <IconStudents className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No students found</p>
          <p className="text-gray-600 text-xs mt-1">Create the first student profile.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4 font-medium">Student ID</th>
                <th className="text-left px-5 py-4 font-medium">Name</th>
                <th className="text-left px-5 py-4 font-medium">Programme</th>
                <th className="text-left px-5 py-4 font-medium">Year</th>
                {isAdmin && <th className="text-right px-5 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{s.studentId}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{s.user?.name || '---'}</td>
                  <td className="px-5 py-3.5 text-gray-400">{s.programme}</td>
                  <td className="px-5 py-3.5 text-gray-400">{s.enrollmentYear}</td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-400" title="Edit">
                          <IconPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-red-400" title="Delete">
                          <IconTrash className="w-4 h-4" />
                        </button>
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
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editing ? 'Edit Student' : 'New Student'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">User ID</label>
                  <input type="text" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required placeholder="MongoDB ObjectId" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Student ID</label>
                <input type="text" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required placeholder="STU-2026-0001" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Programme</label>
                <input type="text" value={form.programme} onChange={(e) => setForm({ ...form, programme: e.target.value })} required placeholder="Computer Science" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Enrollment Year</label>
                <input type="number" value={form.enrollmentYear} onChange={(e) => setForm({ ...form, enrollmentYear: Number(e.target.value) })} required min={2020} max={2030} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-sm border border-gray-700 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
