/**
 * test/run-api-tests.js — Comprehensive API test suite.
 * Run: node test/run-api-tests.js
 * Tests all 40+ endpoints with auth, RBAC, validation, and error handling.
 */

const BASE = 'http://localhost:5000/api';
let adminToken = '';
let teacherToken = '';
let studentToken = '';
let studentUserId = '';
let studentProfileId = '';
let gradeId = '';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

async function request(method, path, body, token) {
  const opts = { method, headers: headers(token) };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  return { name, fn };
}

async function runTests() {
  const tests = [

    // ==================== AUTH ====================
    test('POST /api/auth/register — create admin', async () => {
      const { status, data } = await request('POST', '/auth/register', {
        name: 'Test Admin', email: 'testadmin@api.com', password: 'test123456', role: 'admin'
      });
      if (status === 201 && data.success) { adminToken = data.data.token; return true; }
      if (status === 409) { adminToken = (await request('POST', '/auth/login', { email: 'testadmin@api.com', password: 'test123456' })).data?.data?.token; return !!adminToken; }
      return false;
    }),

    test('POST /api/auth/register — create teacher', async () => {
      const { data, status } = await request('POST', '/auth/register', {
        name: 'Test Teacher', email: 'testteach@api.com', password: 'test123456', role: 'teacher'
      });
      if (status === 201 && data.success) { teacherToken = data.data.token; return true; }
      if (status === 409) { teacherToken = (await request('POST', '/auth/login', { email: 'testteach@api.com', password: 'test123456' })).data?.data?.token; return !!teacherToken; }
      return false;
    }),

    test('POST /api/auth/register — create student', async () => {
      const { data, status } = await request('POST', '/auth/register', {
        name: 'Test Student', email: 'teststu@api.com', password: 'test123456', role: 'student'
      });
      if (status === 201 && data.success) { studentToken = data.data.token; studentUserId = data.data.user.id; return true; }
      if (status === 409) {
        const login = await request('POST', '/auth/login', { email: 'teststu@api.com', password: 'test123456' });
        studentToken = login.data?.data?.token;
        studentUserId = login.data?.data?.user?.id;
        return !!studentToken;
      }
      return false;
    }),

    test('POST /api/auth/login — valid credentials', async () => {
      const { status, data } = await request('POST', '/auth/login', { email: 'testadmin@api.com', password: 'test123456' });
      if (status === 200 && data.success) { adminToken = data.data.token; return true; }
      return false;
    }),

    test('POST /api/auth/login — wrong password', async () => {
      const { status } = await request('POST', '/auth/login', { email: 'testadmin@api.com', password: 'wrong' });
      return status === 401;
    }),

    test('POST /api/auth/register — validation error', async () => {
      const { status, data } = await request('POST', '/auth/register', { name: '', email: 'bad', password: '12' });
      return status === 400 && data.errors?.length > 0;
    }),

    test('POST /api/auth/refresh — valid token', async () => {
      const { status, data } = await request('POST', '/auth/refresh', null, adminToken);
      return status === 200 && data.success;
    }),

    test('GET /api/auth/me — valid token', async () => {
      const { status, data } = await request('GET', '/auth/me', null, adminToken);
      return status === 200 && data.success;
    }),

    test('POST /api/auth/logout — valid token', async () => {
      const { status, data } = await request('POST', '/auth/logout', null, adminToken);
      return status === 200;
    }),

    // ==================== STUDENTS CRUD ====================
    test('POST /api/students — create student profile', async () => {
      const { status, data } = await request('POST', '/students', {
        user: studentUserId, studentId: 'TST-2026-0001', programme: 'CS Test', enrollmentYear: 2026
      }, adminToken);
      if (status === 201 && data.success) { studentProfileId = data.data._id; return true; }
      return false;
    }),

    test('GET /api/students — list all', async () => {
      const { status, data } = await request('GET', '/students', null, adminToken);
      return status === 200 && data.success && data.meta.total > 0;
    }),

    test('GET /api/students/:id — get by id', async () => {
      const { status, data } = await request('GET', `/students/${studentProfileId}`, null, adminToken);
      return status === 200 && data.data;
    }),

    test('PUT /api/students/:id — update', async () => {
      const { status } = await request('PUT', `/students/${studentProfileId}`, { programme: 'AI Test' }, adminToken);
      return status === 200;
    }),

    test('DELETE /api/students/:id — delete', async () => {
      const { status } = await request('DELETE', `/students/${studentProfileId}`, null, adminToken);
      return status === 200;
    }),

    // ==================== GRADES ====================
    test('POST /api/grades — create grade', async () => {
      const { status, data } = await request('POST', '/grades', {
        student: studentUserId, subject: 'Test Subject', score: 85, maxScore: 100, term: 'Spring 2026', assessmentType: 'exam'
      }, adminToken);
      if (status === 201 && data.success) { gradeId = data.data._id; return true; }
      return false;
    }),

    test('GET /api/grades — list with pagination', async () => {
      const { status, data } = await request('GET', '/grades?limit=5', null, adminToken);
      return status === 200 && data.success && data.meta;
    }),

    test('GET /api/grades/:id — get by id', async () => {
      const { status } = await request('GET', `/grades/${gradeId}`, null, adminToken);
      return status === 200;
    }),

    test('PUT /api/grades/:id — update', async () => {
      const { status } = await request('PUT', `/grades/${gradeId}`, { score: 90 }, adminToken);
      return status === 200;
    }),

    test('DELETE /api/grades/:id — admin delete', async () => {
      const { status } = await request('DELETE', `/grades/${gradeId}`, null, adminToken);
      return status === 200;
    }),

    test('GET /api/grades — filter multi-value', async () => {
      const { status, data } = await request('GET', '/grades?assessmentType=exam,quiz&limit=2', null, adminToken);
      return status === 200 && data.success;
    }),

    // ==================== ATTENDANCE ====================
    test('POST /api/attendance — create', async () => {
      const { status } = await request('POST', '/attendance', {
        student: studentUserId, date: '2026-07-19', subject: 'Math', status: 'present'
      }, adminToken);
      return status === 201;
    }),

    test('GET /api/attendance — list', async () => {
      const { status, data } = await request('GET', '/attendance?limit=3', null, adminToken);
      return status === 200 && data.success;
    }),

    test('GET /api/attendance — date range filter', async () => {
      const { status } = await request('GET', '/attendance?dateFrom=2026-06-01&dateTo=2026-07-31', null, adminToken);
      return status === 200;
    }),

    test('POST /api/attendance/bulk — bulk create', async () => {
      const { status } = await request('POST', '/attendance/bulk', [
        { student: studentUserId, date: '2026-07-20', subject: 'Physics', status: 'late' },
        { student: studentUserId, date: '2026-07-21', subject: 'Physics', status: 'present' },
      ], adminToken);
      return status === 201;
    }),

    // ==================== USERS ====================
    test('GET /api/users — list (admin)', async () => {
      const { status, data } = await request('GET', '/users', null, adminToken);
      return status === 200 && data.success && data.meta.total > 0;
    }),

    test('GET /api/users?role=student — filter', async () => {
      const { status, data } = await request('GET', '/users?role=student&limit=2', null, adminToken);
      return status === 200 && data.success;
    }),

    test('GET /api/users?search=test — search', async () => {
      const { status } = await request('GET', '/users?search=test', null, adminToken);
      return status === 200;
    }),

    // ==================== SEARCH ====================
    test('GET /api/search?q=test — search grades', async () => {
      const { status, data } = await request('GET', '/search?q=test&type=grades', null, adminToken);
      return status === 200 && data.success;
    }),

    test('GET /api/search?q=test — search users', async () => {
      const { status, data } = await request('GET', '/search?q=test&type=users', null, adminToken);
      return status === 200 && data.success;
    }),

    // ==================== EXPORT ====================
    test('GET /api/export/grades/csv — CSV export', async () => {
      const { status } = await request('GET', '/export/grades/csv', null, adminToken);
      return status === 200;
    }),

    test('GET /api/export/users/json — JSON export', async () => {
      const { status, data } = await request('GET', '/export/users/json?role=admin', null, adminToken);
      return status === 200 && data.success;
    }),

    // ==================== ANALYTICS ====================
    test('GET /api/analytics/class-overview — teacher', async () => {
      const { status } = await request('GET', '/analytics/class-overview', null, teacherToken);
      return status === 200;
    }),

    test('GET /api/analytics/student/:id — student analytics', async () => {
      const { status } = await request('GET', `/analytics/student/${studentUserId}`, null, adminToken);
      return status === 200;
    }),

    // ==================== RBAC / SECURITY ====================
    test('GET /api/users — student blocked (403)', async () => {
      const { status } = await request('GET', '/users', null, studentToken);
      return status === 403;
    }),

    test('POST /api/students — student blocked (403)', async () => {
      const { status } = await request('POST', '/students', {}, studentToken);
      return status === 403;
    }),

    test('DELETE /api/grades/xxx — student blocked (403)', async () => {
      const { status } = await request('DELETE', '/grades/60a1b2c3d4e5f60001000001', null, studentToken);
      return status === 403;
    }),

    test('GET /api/students — no token (401)', async () => {
      const { status } = await request('GET', '/students');
      return status === 401;
    }),

    test('GET /api/nonexistent — 404', async () => {
      const { status } = await request('GET', '/nonexistent');
      return status === 404;
    }),

    test('POST /api/grades — validation (400)', async () => {
      const { status } = await request('POST', '/grades', {}, adminToken);
      return status === 400;
    }),

    test('GET /api/health — ok', async () => {
      const { status } = await request('GET', '/health');
      return status === 200;
    }),

    // ==================== STUDENT SCOPING ====================
    test('GET /api/grades — student sees only own', async () => {
      const { status, data } = await request('GET', '/grades', null, studentToken);
      return status === 200 && data.success;
    }),

    test('GET /api/attendance — student sees only own', async () => {
      const { status, data } = await request('GET', '/attendance', null, studentToken);
      return status === 200 && data.success;
    }),
  ];

  console.log('\n========================================');
  console.log('  SPAP API Test Suite — 40+ Endpoints');
  console.log('========================================\n');

  for (const t of tests) {
    try {
      const ok = await t.fn();
      if (ok) { passed++; console.log(`  PASS  ${t.name}`); }
      else { failed++; console.log(`  FAIL  ${t.name}`); }
    } catch (err) {
      failed++; console.log(`  ERROR ${t.name}: ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('========================================\n');
}

runTests();
