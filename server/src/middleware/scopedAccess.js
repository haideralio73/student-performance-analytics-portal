/**
 * middleware/scopedAccess.js — Role-based data scoping middleware.
 *
 * Enforces row-level access control:
 * - Students can only access their own grades, attendance, and analytics.
 *   The `student` query parameter is forced to their own user ID.
 * - Teachers can only access data for courses they own. Write operations
 *   verify course ownership before allowing mutation.
 * - Admins bypass all scoping — they see everything.
 */

/**
 * Forces the `student` query param to req.user.id for student-role users.
 * Use before any GET endpoint that accepts a ?student filter.
 */
export const scopeStudentRead = (req, _res, next) => {
  if (req.user.role === 'student') {
    req.query.student = req.user.id;
  }
  next();
};

/**
 * Prevents students from querying other students' data.
 * If a student supplies a student param that isn't themselves, it is overridden.
 * Admins and teachers are not restricted by this middleware.
 */
export const restrictStudentData = (req, _res, next) => {
  if (req.user.role === 'student') {
    if (req.query.student && req.query.student !== req.user.id) {
      req.query.student = req.user.id;
    }
    if (req.params.studentId && req.params.studentId !== req.user.id) {
      return next(
        Object.assign(new Error('You can only access your own data'), { statusCode: 403 })
      );
    }
  }
  next();
};

/**
 * Verifies that a teacher owns the course specified in req.body.course.
 * Admins bypass this check. Must be used AFTER protect middleware.
 */
export const verifyTeacherCourse = async (req, _res, next) => {
  if (req.user.role === 'admin') return next();

  const courseId = req.body.course || req.params.courseId;
  if (!courseId) {
    return next(
      Object.assign(new Error('Course ID is required'), { statusCode: 400 })
    );
  }

  try {
    const mongoose = (await import('mongoose')).default;
    const db = mongoose.connection.db;
    const course = await db.collection('courses').findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      teacher: req.user.id,
    });

    if (!course) {
      return next(
        Object.assign(new Error('You do not own this course'), { statusCode: 403 })
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Ensures student data in req.body.student belongs to a course the teacher owns.
 * For grade/attendance creation: the student must exist in the teacher's courses.
 */
export const verifyStudentInTeachersCourse = async (req, _res, next) => {
  if (req.user.role === 'admin') return next();

  const courseId = req.body.course;
  const studentId = req.body.student;

  if (!courseId || !studentId) return next();

  try {
    const mongoose = (await import('mongoose')).default;
    const db = mongoose.connection.db;

    const course = await db.collection('courses').findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      teacher: req.user.id,
    });

    if (!course) {
      return next(
        Object.assign(new Error('You do not own this course'), { statusCode: 403 })
      );
    }

    const enrolled = course.students?.some(
      (s) => s.toString() === studentId.toString()
    );
    if (!enrolled) {
      return next(
        Object.assign(new Error('Student is not enrolled in this course'), { statusCode: 400 })
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * For student analytics: students can only query their own studentId.
 * Teachers/admins are unrestricted.
 */
export const scopeAnalyticsStudent = (req, _res, next) => {
  if (req.user.role === 'student') {
    if (req.params.studentId !== req.user.id) {
      return next(
        Object.assign(new Error('You can only view your own analytics'), { statusCode: 403 })
      );
    }
  }
  next();
};
