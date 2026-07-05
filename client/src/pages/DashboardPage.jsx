/**
 * pages/DashboardPage.jsx — Role-aware dashboard.
 *
 * Renders completely different views based on user role:
 * Student: personal stats, grades, attendance
 * Teacher: course list, class performance, quick actions
 * Admin: system stats, user management, course overview
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';

/* ==================== SHARED COMPONENTS ==================== */

function StatCard({ label, value, color }) {
  const gradients = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    amber: 'from-amber-600 to-amber-700',
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[color] || gradients.blue} flex items-center justify-center mb-3`}>
        <span className="text-white text-lg font-bold">{typeof value === 'number' ? (value > 99 ? '...' : '') : ''}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <div className="text-4xl mb-3">---</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/* ==================== STUDENT DASHBOARD ==================== */

function StudentDashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(`/analytics/student/${user?.id}`);

  if (loading) return <Loading />;
  const summary = data || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Average" value={`${summary.averageScore || 0}%`} color="blue" />
        <StatCard label="Attendance Rate" value={`${summary.attendanceRate || 0}%`} color="green" />
        <StatCard label="Total Assessments" value={summary.totalAssessments || 0} color="purple" />
        <StatCard label="Sessions Attended" value={summary.totalSessions || 0} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Performance Trend</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: Score trend over time ]</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Attendance Breakdown</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: Present / Absent / Late ]</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/grades"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View My Grades
        </Link>
        <Link
          to="/attendance"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
          View Attendance
        </Link>
      </div>
    </div>
  );
}

/* ==================== TEACHER DASHBOARD ==================== */

function TeacherDashboard() {
  const { data, loading } = useFetch('/analytics/class-overview');

  if (loading) return <Loading />;

  const dist = data?.gradeDistribution || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={3} color="blue" />
        <StatCard label="Total Students" value={95} color="green" />
        <StatCard label="Class Average" value="81.4%" color="purple" />
        <StatCard label="Attendance Rate" value="85.2%" color="amber" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/grades"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Enter Grades
        </Link>
        <Link
          to="/attendance"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Mark Attendance
        </Link>
        <Link
          to="/analytics"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
          View Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { name: 'Data Structures', code: 'CS-201', students: 32, avg: '81.4%', att: '85%' },
          { name: 'Linear Algebra', code: 'MTH-102', students: 28, avg: '78.2%', att: '90%' },
          { name: 'Calculus I', code: 'MTH-101', students: 35, avg: '74.6%', att: '82%' },
        ].map((course) => (
          <div key={course.code} className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors">
            <div className="text-xs text-gray-500 font-mono mb-1">{course.code}</div>
            <h3 className="text-white font-semibold text-sm">{course.name}</h3>
            <p className="text-gray-400 text-xs mt-1">{course.students} students enrolled</p>
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700">
              <div><span className="text-gray-500 text-xs">Avg</span><div className="text-white font-semibold text-sm">{course.avg}</div></div>
              <div><span className="text-gray-500 text-xs">Attendance</span><div className="text-white font-semibold text-sm">{course.att}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Grade Distribution</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: A/B/C/D/F distribution ]</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Attendance Trend</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: Weekly attendance % ]</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== ADMIN DASHBOARD ==================== */

function AdminDashboard() {
  const { data: students, loading: studentsLoading } = useFetch('/students');
  const { data: users, loading: usersLoading } = useFetch('/users');

  if (studentsLoading || usersLoading) return <Loading />;

  const studentList = Array.isArray(students) ? students : [];
  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/users" className="block">
          <StatCard label="Total Users" value={userList.length} color="blue" />
        </Link>
        <Link to="/students" className="block">
          <StatCard label="Students" value={studentList.length} color="green" />
        </Link>
        <div><StatCard label="Courses" value={48} color="purple" /></div>
        <div><StatCard label="Attendance Rate" value="84.2%" color="amber" /></div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Users</h3>
          <Link to="/users" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {userList.slice(0, 5).map((u) => (
                <tr key={u._id || u.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-gray-400">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      u.role === 'admin' ? 'bg-red-900/50 text-red-300' :
                      u.role === 'teacher' ? 'bg-blue-900/50 text-blue-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'}
                  </td>
                </tr>
              ))}
              {userList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500 text-sm">
                    No users registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">System Analytics</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: Grade distribution across all courses ]</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Enrollment Overview</h3>
          <div className="h-48 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
            <span className="text-gray-500 text-sm">[ Chart: Students per programme ]</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== MAIN DASHBOARD ==================== */

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}
