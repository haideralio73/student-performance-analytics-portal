/**
 * pages/StudentsPage.jsx — Professional student roster with CRUD.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import { IconPlus, IconPencil, IconTrash, IconX, IconStudents } from '../components/shared/Icons';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [students, setStudents] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ user: '', studentId: '', programme: '', enrollmentYear: new Date().getFullYear() });
  const [submitting, setSubmitting] = useState(false);
  const [useExistingUser, setUseExistingUser] = useState(true);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const fetchStudents = async () => {
    try { setLoading(true); const data = await getStudents(); setStudents(Array.isArray(data) ? data : []); }
    catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  const fetchAvailableUsers = async () => {
    try {
      const res = await api.get('/users?role=student&limit=100');
      const allUsers = res.data.data || [];
      const existingUserIds = students.map((s) => s.user?._id || s.user);
      const available = allUsers.filter((u) => !existingUserIds.includes(u._id || u.id));
      setAvailableUsers(available);
    } catch { /* ok */ }
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { fetchAvailableUsers(); }, [students.length]);

  const openCreate = () => {
    setEditing(null);
    setForm({ user: '', studentId: '', programme: '', enrollmentYear: new Date().getFullYear() });
    setNewUserName(''); setNewUserEmail(''); setNewUserPassword('');
    setUseExistingUser(true);
    fetchAvailableUsers();
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      user: s.user?._id || s.user || '',
      studentId: s.studentId || '',
      programme: s.programme || '',
      enrollmentYear: s.enrollmentYear || new Date().getFullYear(),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      let userId = form.user;

      if (!editing && !useExistingUser) {
        const regRes = await api.post('/auth/register', {
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: 'student',
        });
        userId = regRes.data.data.user.id;
      }

      const payload = { ...form, user: userId };

      if (editing) {
        await updateStudent(editing._id, payload);
        toast.success('Student updated');
      } else {
        await createStudent(payload);
        toast.success('Student created');
      }
      setShowModal(false); fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try { await deleteStudent(id); toast.success('Student removed'); fetchStudents(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 flex items-center justify-center">
            <IconStudents className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Student Roster</h2>
            <p className="text-xs text-gray-500 mt-0.5">{students.length} students enrolled</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">
            <IconPlus className="w-4 h-4" /> Add Student
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800/80">
          <IconStudents className="w-14 h-14 text-gray-800 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-1">No students yet</h3>
          <p className="text-gray-500 text-sm mb-4">Create the first student profile to get started.</p>
          {isAdmin && <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"><IconPlus className="w-4 h-4" /> Add Student</button>}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-950/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Student ID</th>
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Programme</th>
                <th className="text-left px-6 py-4 font-medium">Year</th>
                {isAdmin && <th className="text-right px-6 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{s.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-bold">{s.user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                      <span className="text-white font-medium">{s.user?.name || '---'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{s.programme}</td>
                  <td className="px-6 py-4 text-gray-400">{s.enrollmentYear}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-500 hover:text-blue-400" title="Edit"><IconPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-500 hover:text-red-400" title="Delete"><IconTrash className="w-4 h-4" /></button>
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
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Student' : 'New Student'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-white"><IconX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-shrink">
              {!editing && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <button type="button" onClick={() => setUseExistingUser(true)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${useExistingUser ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>Existing User</button>
                    <button type="button" onClick={() => setUseExistingUser(false)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${!useExistingUser ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>Create New</button>
                  </div>

                  {useExistingUser ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Select User</label>
                      <select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <option value="">-- Select a registered user --</option>
                        {availableUsers.map((u) => (
                          <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required={!useExistingUser} placeholder="John Doe" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required={!useExistingUser} placeholder="john@uni.edu" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required={!useExistingUser} minLength={6} placeholder="Min 6 chars" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Student ID</label>
                <input type="text" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required placeholder="STU-2026-0001" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Programme</label>
                <input type="text" value={form.programme} onChange={(e) => setForm({ ...form, programme: e.target.value })} required placeholder="Computer Science" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Enrollment Year</label>
                <input type="number" value={form.enrollmentYear} onChange={(e) => setForm({ ...form, enrollmentYear: Number(e.target.value) })} required min={2020} max={2030} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all">{submitting ? 'Saving...' : editing ? 'Update Student' : 'Create Student'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl text-sm border border-gray-700 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
