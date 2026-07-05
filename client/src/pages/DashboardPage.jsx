/**
 * pages/DashboardPage.jsx — Role-aware dashboard with SVG icons.
 *
 * Renders role-specific dashboard: Student, Teacher, or Admin.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import {
  IconGrades,
  IconAttendance,
  IconAnalytics,
  IconStudents,
  IconPlus,
  IconUsers,
} from '../components/shared/Icons';

/* ==================== SHARED COMPONENTS ==================== */

function StatCard({ label, value, icon: Icon, accent }) {
  const accents = {
    blue: 'from-blue-600 to-blue-700 shadow-blue-600/20',
    green: 'from-emerald-600 to-emerald-700 shadow-emerald-600/20',
    purple: 'from-purple-600 to-purple-700 shadow-purple-600/20',
    amber: 'from-amber-600 to-amber-700 shadow-amber-600/20',
    pink: 'from-pink-600 to-pink-700 shadow-pink-600/20',
    cyan: 'from-cyan-600 to-cyan-700 shadow-cyan-600/20',
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accents[accent] || accents.blue} shadow-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

/* ==================== STUDENT DASHBOARD ==================== */

function StudentDashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(`/analytics/student/${user?.id}`);

  if (loading) return <Loading />;
  const s = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}</h2>
        <p className="text-gray-400 text-sm mt-1">Here is your academic overview for this semester.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Average" value={`${s.averageScore || 0}%`} icon={IconAnalytics} accent="blue" />
        <StatCard label="Attendance Rate" value={`${s.attendanceRate || 0}%`} icon={IconAttendance} accent="green" />
        <StatCard label="Assessments" value={s.totalAssessments || 0} icon={IconGrades} accent="purple" />
        <StatCard label="Sessions" value={s.totalSessions || 0} icon={IconStudents} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Performance Trend</h3>
          <div className="h-52 bg-gradient-to-b from-gray-800/50 to-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
            <div className="text-center">
              <IconAnalytics className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <span className="text-gray-600 text-sm">Chart: Score trend over time</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Attendance Breakdown</h3>
          <div className="h-52 bg-gradient-to-b from-gray-800/50 to-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
            <div className="text-center">
              <IconAttendance className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <span className="text-gray-600 text-sm">Chart: Present / Absent / Late</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/grades" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
          <IconGrades className="w-4 h-4" /> View My Grades
        </Link>
        <Link to="/attendance" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          <IconAttendance className="w-4 h-4" /> View Attendance
        </Link>
      </div>
    </div>
  );
}

/* ==================== TEACHER DASHBOARD ==================== */

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Instructor Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your courses, grades, and attendance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={3} icon={IconGrades} accent="blue" />
        <StatCard label="Total Students" value={95} icon={IconStudents} accent="green" />
        <StatCard label="Class Average" value="81.4%" icon={IconAnalytics} accent="purple" />
        <StatCard label="Attendance" value="85.2%" icon={IconAttendance} accent="amber" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/grades" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
          <IconPlus className="w-4 h-4" /> Enter Grades
        </Link>
        <Link to="/attendance" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all">
          <IconAttendance className="w-4 h-4" /> Mark Attendance
        </Link>
        <Link to="/analytics" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          <IconAnalytics className="w-4 h-4" /> View Analytics
        </Link>
      </div>

      <h3 className="text-sm font-semibold text-white pt-2">My Courses</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { name: 'Data Structures', code: 'CS-201', students: 32, avg: '81.4%', att: '85%', accent: 'blue' },
          { name: 'Linear Algebra', code: 'MTH-102', students: 28, avg: '78.2%', att: '90%', accent: 'purple' },
          { name: 'Calculus I', code: 'MTH-101', students: 35, avg: '74.6%', att: '82%', accent: 'amber' },
        ].map((course) => {
          const accents = {
            blue: 'border-l-blue-600',
            purple: 'border-l-purple-600',
            amber: 'border-l-amber-600',
          };
          return (
            <div key={course.code} className="bg-gray-900 rounded-2xl border border-gray-800 border-l-4 p-5 hover:border-gray-700 transition-all group" style={{ borderLeftColor: course.accent === 'blue' ? '#2563eb' : course.accent === 'purple' ? '#7c3aed' : '#d97706' }}>
              <div className="text-xs text-gray-500 font-mono mb-1">{course.code}</div>
              <h4 className="text-white font-semibold text-sm">{course.name}</h4>
              <p className="text-gray-500 text-xs mt-1">{course.students} students enrolled</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-800">
                <div><span className="text-gray-500 text-[10px] uppercase tracking-wider">Avg</span><div className="text-white font-semibold text-sm">{course.avg}</div></div>
                <div><span className="text-gray-500 text-[10px] uppercase tracking-wider">Attendance</span><div className="text-white font-semibold text-sm">{course.att}</div></div>
              </div>
            </div>
          );
        })}
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

  const roleStyle = (role) => {
    const s = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      student: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return s[role] || s.student;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Administrator Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">System-wide overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/users" className="block">
          <StatCard label="Total Users" value={userList.length} icon={IconUsers} accent="blue" />
        </Link>
        <Link to="/students" className="block">
          <StatCard label="Students" value={studentList.length} icon={IconStudents} accent="green" />
        </Link>
        <div><StatCard label="Courses" value={48} icon={IconGrades} accent="purple" /></div>
        <div><StatCard label="Avg Attendance" value="84.2%" icon={IconAttendance} accent="amber" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link to="/users" className="block group">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <IconUsers className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">User Management</h3>
                <p className="text-xs text-gray-500">{userList.length} registered users</p>
              </div>
            </div>
            <div className="space-y-2">
              {userList.slice(0, 3).map((u) => (
                <div key={u._id || u.id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <div>
                    <div className="text-sm text-white">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg border capitalize ${roleStyle(u.role)}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        <Link to="/students" className="block group">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
                <IconStudents className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Student Roster</h3>
                <p className="text-xs text-gray-500">{studentList.length} enrolled students</p>
              </div>
            </div>
            <div className="space-y-2">
              {studentList.slice(0, 3).map((s) => (
                <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <div>
                    <div className="text-sm text-white">{s.user?.name || '---'}</div>
                    <div className="text-xs text-gray-500">{s.studentId}</div>
                  </div>
                  <span className="text-xs text-gray-500">{s.programme}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ==================== MAIN ==================== */

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}
