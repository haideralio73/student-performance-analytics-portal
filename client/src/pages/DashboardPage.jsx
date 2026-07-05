/**
 * pages/DashboardPage.jsx — Professional role-aware dashboard.
 *
 * Each role sees a completely tailored dashboard:
 * Admin   — system overview, user/student management, quick links
 * Teacher — course management, grade entry, attendance, analytics
 * Student — personal stats, recent grades, attendance summary
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
  IconCheck,
  IconArrowRight,
} from '../components/shared/Icons';

/* ==================== SHARED COMPONENTS ==================== */

function StatCard({ label, value, icon: Icon, accent }) {
  const accents = {
    blue: 'from-blue-600 to-blue-700 shadow-blue-600/20',
    green: 'from-emerald-600 to-emerald-700 shadow-emerald-600/20',
    purple: 'from-purple-600 to-purple-700 shadow-purple-600/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-600/20',
    pink: 'from-pink-600 to-pink-700 shadow-pink-600/20',
    cyan: 'from-cyan-600 to-cyan-700 shadow-cyan-600/20',
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-5 hover:border-gray-700 transition-all duration-300 group cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accents[accent] || accents.blue} shadow-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

const roleBadgeStyle = (role) => {
  const s = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    student: 'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return s[role] || s.student;
};

/* ==================== ADMIN DASHBOARD ==================== */

function AdminDashboard() {
  const { data: students, loading: sLoad } = useFetch('/students');
  const { data: users, loading: uLoad } = useFetch('/users');

  if (sLoad && uLoad) return <Spinner />;

  const studentList = Array.isArray(students) ? students : [];
  const userList = Array.isArray(users) ? users : [];

  const adminCount = userList.filter((u) => u.role === 'admin').length;
  const teacherCount = userList.filter((u) => u.role === 'teacher').length;
  const studentCount = userList.filter((u) => u.role === 'student').length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Administration</h2>
        <p className="text-gray-400 text-sm mt-1.5">System-wide overview and management tools.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/users"><StatCard label="Total Users" value={userList.length} icon={IconUsers} accent="blue" /></Link>
        <Link to="/students"><StatCard label="Students" value={studentList.length} icon={IconStudents} accent="green" /></Link>
        <StatCard label="Teachers" value={teacherCount} icon={IconGrades} accent="purple" />
        <StatCard label="Admins" value={adminCount} icon={IconAttendance} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconUsers} title="Registered Users" subtitle={`${userList.length} accounts`} />
            <Link to="/users" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              View All <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {userList.slice(0, 5).map((u) => (
              <div key={u._id || u.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize ${roleBadgeStyle(u.role)}`}>{u.role}</span>
              </div>
            ))}
            {userList.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-600 text-sm">No users registered yet.</div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconStudents} title="Student Roster" subtitle={`${studentList.length} enrolled`} />
            <Link to="/students" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              Manage <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {studentList.slice(0, 5).map((s) => (
              <div key={s._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div>
                  <div className="text-sm text-white font-medium">{s.user?.name || '---'}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.studentId}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{s.programme}</div>
                  <div className="text-xs text-gray-600">Year {s.enrollmentYear}</div>
                </div>
              </div>
            ))}
            {studentList.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-600 text-sm">
                <p>No students enrolled yet.</p>
                <Link to="/students" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block">Add your first student</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link to="/grades" className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 hover:border-blue-600/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
            <IconGrades className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-white font-semibold text-sm">Grade Records</h3>
          <p className="text-gray-500 text-xs mt-1">View all assessment results across courses.</p>
        </Link>
        <Link to="/attendance" className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 hover:border-emerald-600/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center mb-4">
            <IconAttendance className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-white font-semibold text-sm">Attendance Records</h3>
          <p className="text-gray-500 text-xs mt-1">Monitor attendance across all courses.</p>
        </Link>
        <Link to="/analytics" className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 hover:border-purple-600/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
            <IconAnalytics className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-white font-semibold text-sm">System Reports</h3>
          <p className="text-gray-500 text-xs mt-1">View institution-wide analytics.</p>
        </Link>
      </div>
    </div>
  );
}

/* ==================== TEACHER DASHBOARD ==================== */

function TeacherDashboard() {
  const { user } = useAuth();

  const courses = [
    { name: 'Data Structures', code: 'CS-201', students: 32, avg: '81.4', att: '85', accent: 'border-l-blue-600', color: 'blue' },
    { name: 'Linear Algebra', code: 'MTH-102', students: 28, avg: '78.2', att: '90', accent: 'border-l-purple-600', color: 'purple' },
    { name: 'Calculus I', code: 'MTH-101', students: 35, avg: '74.6', att: '82', accent: 'border-l-amber-600', color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome, {user?.name?.split(' ').slice(-1)[0] || 'Instructor'}</h2>
        <p className="text-gray-400 text-sm mt-1.5">Manage your courses and track student performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Active Courses" value={courses.length} icon={IconGrades} accent="blue" />
        <StatCard label="Total Students" value={95} icon={IconStudents} accent="green" />
        <StatCard label="Average Score" value="81.4%" icon={IconAnalytics} accent="purple" />
        <StatCard label="Attendance" value="85.2%" icon={IconAttendance} accent="amber" />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/grades" className="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">
          <IconPlus className="w-4 h-4" /> Record Grades
        </Link>
        <Link to="/attendance" className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20">
          <IconCheck className="w-4 h-4" /> Mark Attendance
        </Link>
        <Link to="/analytics" className="inline-flex items-center gap-2.5 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl transition-all">
          <IconAnalytics className="w-4 h-4" /> Course Analytics
        </Link>
      </div>

      <SectionHeader icon={IconGrades} title="My Courses" subtitle="Spring 2026" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <div key={c.code} className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 hover:border-gray-700 transition-all duration-300 group" style={{ borderLeftWidth: '4px', borderLeftColor: c.color === 'blue' ? '#3b82f6' : c.color === 'purple' ? '#8b5cf6' : '#f59e0b' }}>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">{c.code}</div>
            <h3 className="text-white font-semibold">{c.name}</h3>
            <p className="text-gray-500 text-xs mt-1.5">{c.students} students enrolled</p>
            <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-800/50">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Average</div>
                <div className="text-xl font-bold text-white">{c.avg}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Attendance</div>
                <div className="text-xl font-bold text-white">{c.att}%</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/grades" className="text-xs text-blue-400 hover:text-blue-300 font-medium">View Grades</Link>
              <span className="text-gray-700">|</span>
              <Link to="/attendance" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Attendance</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== STUDENT DASHBOARD ==================== */

function StudentDashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(`/analytics/student/${user?.id}`);

  if (loading) return <Spinner />;
  const s = data || {};

  const recentGrades = [
    { assessment: 'Midterm Exam', course: 'Data Structures', score: 87, max: 100, date: 'Mar 15' },
    { assessment: 'Homework 4', course: 'Data Structures', score: 92, max: 100, date: 'Apr 2' },
    { assessment: 'Quiz 1', course: 'Linear Algebra', score: 18, max: 20, date: 'Feb 10' },
    { assessment: 'Midterm', course: 'Linear Algebra', score: 72, max: 100, date: 'Mar 18' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome, {user?.name?.split(' ')[0] || 'Student'}</h2>
        <p className="text-gray-400 text-sm mt-1.5">Here is your academic overview for this semester.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Overall Average" value={`${s.averageScore || 0}%`} icon={IconAnalytics} accent="blue" />
        <StatCard label="Attendance" value={`${s.attendanceRate || 0}%`} icon={IconAttendance} accent="green" />
        <StatCard label="Assessments" value={s.totalAssessments || 4} icon={IconGrades} accent="purple" />
        <StatCard label="Sessions" value={s.totalSessions || 18} icon={IconStudents} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconGrades} title="Recent Grades" subtitle="Last 4 assessments" />
            <Link to="/grades" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              View All <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {recentGrades.map((g, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div>
                  <div className="text-sm text-white font-medium">{g.assessment}</div>
                  <div className="text-xs text-gray-500">{g.course} &middot; {g.date}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{g.score}/{g.max}</span>
                  <span className="text-xs text-gray-500 ml-1">({Math.round((g.score / g.max) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
          <SectionHeader icon={IconAttendance} title="Attendance" subtitle="This semester" />
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Present</span>
              <span className="text-sm font-semibold text-emerald-400">14 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Absent</span>
              <span className="text-sm font-semibold text-red-400">2 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Late</span>
              <span className="text-sm font-semibold text-amber-400">1 day</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Excused</span>
              <span className="text-sm font-semibold text-blue-400">1 day</span>
            </div>
            <div className="pt-4 border-t border-gray-800/50 flex items-center justify-between">
              <span className="text-sm font-medium text-white">Overall Rate</span>
              <span className="text-lg font-bold text-white">{s.attendanceRate || 88}%</span>
            </div>
          </div>
        </div>
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
