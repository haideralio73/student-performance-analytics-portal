/**
 * pages/StudentsPage.jsx — Student management (Admin/Teacher).
 *
 * Lists all student profiles in a table. Admins can add,
 * edit, and delete students via modal dialogs.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentService';
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
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await deleteStudent(id);
      toast.success('Student removed');
      fetchStudents();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          Students
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({students.length} total)
          </span>
        </h2>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Student
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No students found</p>
          <p className="text-sm">Create the first student profile to get started.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Student ID</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Programme</th>
                  <th className="text-left px-5 py-3 font-medium">Year</th>
                  {isAdmin && <th className="text-right px-5 py-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3 text-gray-300 font-mono text-xs">{s.studentId}</td>
                    <td className="px-5 py-3 text-white font-medium">
                      {s.user?.name || s.user || '---'}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{s.programme}</td>
                    <td className="px-5 py-3 text-gray-400">{s.enrollmentYear}</td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg shadow-xl">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">
                {editing ? 'Edit Student' : 'Add Student'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={form.user}
                    onChange={(e) => setForm({ ...form, user: e.target.value })}
                    required
                    placeholder="MongoDB ObjectId"
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">ID of an existing User document</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Student ID
                </label>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  required
                  placeholder="STU-2026-0001"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Programme
                </label>
                <input
                  type="text"
                  value={form.programme}
                  onChange={(e) => setForm({ ...form, programme: e.target.value })}
                  required
                  placeholder="Computer Science"
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Enrollment Year
                </label>
                <input
                  type="number"
                  value={form.enrollmentYear}
                  onChange={(e) => setForm({ ...form, enrollmentYear: Number(e.target.value) })}
                  required
                  min={2020}
                  max={2030}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
                >
                  {editing ? 'Update Student' : 'Create Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
