/**
 * pages/DashboardPage.jsx — Role-aware dashboard with real Recharts visualizations.
 */

import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import {
  IconGrades, IconAttendance, IconAnalytics, IconStudents,
  IconPlus, IconUsers, IconCheck, IconArrowRight,
} from '../components/shared/Icons';
import GradeTrendChart from '../components/analytics/GradeTrendChart';
import AttendanceChart from '../components/analytics/AttendanceChart';
import GradeDistributionChart from '../components/analytics/GradeDistributionChart';
import SubjectPerformanceChart from '../components/analytics/SubjectPerformanceChart';

/* ==================== SHARED ==================== */

function StatCard({ label, value, icon: Icon, accent }) {
  const acc = {
    blue: 'from-blue-600 to-blue-700 shadow-blue-600/20',
    green: 'from-emerald-600 to-emerald-700 shadow-emerald-600/20',
    purple: 'from-purple-600 to-purple-700 shadow-purple-600/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-600/20',
  };
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-5 hover:border-gray-700 transition-all duration-300 cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${acc[accent] || acc.blue} shadow-lg flex items-center justify-center flex-shrink-0`}>
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
        {Icon && <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center"><Icon className="w-4 h-4 text-gray-400" /></div>}
        <div><h3 className="text-sm font-semibold text-white">{title}</h3>{subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}</div>
      </div>
      {action}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
}

const roleBadgeStyle = (role) => {
  const s = { admin: 'bg-red-500/10 text-red-400 border-red-500/20', teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20', student: 'bg-green-500/10 text-green-400 border-green-500/20' };
  return s[role] || s.student;
};

/* ==================== ADMIN ==================== */

function AdminDashboard() {
  const { data: students, loading: sLoad } = useFetch('/students');
  const { data: users, loading: uLoad } = useFetch('/users');
  if (sLoad && uLoad) return <Spinner />;

  const studentList = Array.isArray(students) ? students : [];
  const userList = Array.isArray(users) ? users : [];
  const teacherCount = userList.filter((u) => u.role === 'teacher').length;

  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold text-white tracking-tight">Administration</h2><p className="text-gray-400 text-sm mt-1.5">System-wide overview and management tools.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/users"><StatCard label="Total Users" value={userList.length} icon={IconUsers} accent="blue" /></Link>
        <Link to="/students"><StatCard label="Students" value={studentList.length} icon={IconStudents} accent="green" /></Link>
        <StatCard label="Teachers" value={teacherCount} icon={IconGrades} accent="purple" />
        <StatCard label="Attendance" value="84.2%" icon={IconAttendance} accent="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconUsers} title="Registered Users" subtitle={`${userList.length} accounts`} />
            <Link to="/users" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">View All <IconArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {userList.slice(0, 5).map((u) => (
              <div key={u._id||u.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</div>
                  <div><div className="text-sm text-white font-medium">{u.name}</div><div className="text-xs text-gray-500">{u.email}</div></div>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize ${roleBadgeStyle(u.role)}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconStudents} title="Student Roster" subtitle={`${studentList.length} enrolled`} />
            <Link to="/students" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">Manage <IconArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {studentList.slice(0, 5).map((s) => (
              <div key={s._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div><div className="text-sm text-white font-medium">{s.user?.name||'---'}</div><div className="text-xs text-gray-500 font-mono">{s.studentId}</div></div>
                <div className="text-right"><div className="text-xs text-gray-400">{s.programme}</div><div className="text-xs text-gray-600">Year {s.enrollmentYear}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { to:'/grades', icon:IconGrades, color:'blue', label:'Grade Records', desc:'View all assessment results' },
          { to:'/attendance', icon:IconAttendance, color:'emerald', label:'Attendance Records', desc:'Monitor attendance' },
          { to:'/analytics', icon:IconAnalytics, color:'purple', label:'System Reports', desc:'Institution-wide analytics' },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6 hover:border-gray-700 transition-all group">
            <div className={`w-10 h-10 rounded-xl bg-${c.color}-600/20 flex items-center justify-center mb-4`}><c.icon className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" /></div>
            <h3 className="text-white font-semibold text-sm">{c.label}</h3>
            <p className="text-gray-500 text-xs mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ==================== TEACHER ==================== */

function TeacherDashboard() {
  const { user } = useAuth();
  const { data: grades, loading: gLoad } = useFetch('/grades');
  const { data: attendance, loading: aLoad } = useFetch('/attendance');
  const gradeList = Array.isArray(grades) ? grades : [];
  const attList = Array.isArray(attendance) ? attendance : [];

  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold text-white tracking-tight">Welcome, {user?.name?.split(' ').slice(-1)[0]}</h2><p className="text-gray-400 text-sm mt-1.5">Manage your courses and track student performance.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Active Courses" value={3} icon={IconGrades} accent="blue" />
        <StatCard label="Total Students" value={95} icon={IconStudents} accent="green" />
        <StatCard label="Grades Recorded" value={gradeList.length} icon={IconAnalytics} accent="purple" />
        <StatCard label="Attendance" value={`${attList.length} sessions`} icon={IconAttendance} accent="amber" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Link to="/grades" className="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20"><IconPlus className="w-4 h-4" /> Record Grades</Link>
        <Link to="/attendance" className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20"><IconCheck className="w-4 h-4" /> Mark Attendance</Link>
        <Link to="/analytics" className="inline-flex items-center gap-2.5 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-medium rounded-xl"><IconAnalytics className="w-4 h-4" /> Course Analytics</Link>
      </div>

      {!gLoad && gradeList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Grade Distribution</h3>
            <div className="h-64"><GradeDistributionChart grades={gradeList} /></div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Subject Performance</h3>
            <div className="h-64"><SubjectPerformanceChart grades={gradeList} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== STUDENT ==================== */

function StudentDashboard() {
  const { user } = useAuth();
  const { data: grades, loading: gLoad } = useFetch('/grades');
  const { data: attendance, loading: aLoad } = useFetch('/attendance');
  const { data: analytics } = useFetch(`/analytics/student/${user?.id}`);

  const gradeList = Array.isArray(grades) ? grades : [];
  const attList = Array.isArray(attendance) ? attendance : [];
  const avg = gradeList.length > 0 ? Math.round(gradeList.reduce((s, g) => s + (g.score/g.maxScore)*100, 0) / gradeList.length * 10) / 10 : 0;
  const present = attList.filter((a) => a.status === 'present').length;
  const attRate = attList.length > 0 ? Math.round((present / attList.length) * 100) : 0;

  if (gLoad && aLoad) return <Spinner />;

  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold text-white tracking-tight">Welcome, {user?.name?.split(' ')[0]}</h2><p className="text-gray-400 text-sm mt-1.5">Your academic overview for Spring 2026.</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Overall Average" value={`${avg}%`} icon={IconAnalytics} accent="blue" />
        <StatCard label="Attendance Rate" value={`${attRate}%`} icon={IconAttendance} accent="green" />
        <StatCard label="Assessments" value={gradeList.length} icon={IconGrades} accent="purple" />
        <StatCard label="Sessions" value={attList.length} icon={IconStudents} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
          <SectionHeader icon={IconAnalytics} title="Performance Trend" subtitle="Score progression" />
          <div className="h-64 mt-2"><GradeTrendChart grades={gradeList} /></div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
          <SectionHeader icon={IconAttendance} title="Attendance Breakdown" subtitle={`${attRate}% present`} />
          <div className="h-64 mt-2"><AttendanceChart records={attList} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
          <SectionHeader icon={IconGrades} title="Grade Distribution" subtitle="A/B/C/D/F breakdown" />
          <div className="h-56 mt-2"><GradeDistributionChart grades={gradeList} /></div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 p-6">
          <SectionHeader icon={IconStudents} title="Subject Performance" subtitle="Average by course" />
          <div className="h-56 mt-2"><SubjectPerformanceChart grades={gradeList} /></div>
        </div>
      </div>

      {gradeList.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <SectionHeader icon={IconGrades} title="Recent Grades" subtitle="Latest 5 assessments" />
            <Link to="/grades" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">View All <IconArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-800/40">
            {gradeList.slice(-5).reverse().map((g, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div><div className="text-sm text-white font-medium">{g.assessmentName || g.subject}</div><div className="text-xs text-gray-500">{g.subject} &middot; {g.assessmentType}</div></div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{g.score}/{g.maxScore}</span>
                  <span className={`ml-2 text-xs font-medium ${(g.score/g.maxScore)*100 >= 75 ? 'text-emerald-400' : (g.score/g.maxScore)*100 >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {Math.round((g.score/g.maxScore)*100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}
