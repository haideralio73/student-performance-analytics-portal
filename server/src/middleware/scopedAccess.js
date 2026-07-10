/**
 * middleware/scopedAccess.js — Role-based data scoping middleware.
 *
 * Enforces row-level access control:
 * - Students can only access their own grades, attendance, and analytics.
 * - Teachers can only access data for courses they own.
 * - Admins bypass all scoping — they see everything.
 */

import mongoose from 'mongoose';

/**
 * Resolves User ID -> Student profile ObjectId for accurate queries.
 * Grades and attendance reference the Student collection, not User.
 */
async function getStudentProfileId(userId) {
  try {
    const profile = await mongoose.connection.db
      .collection('students')
      .findOne(
        { user: new mongoose.Types.ObjectId(userId) },
        { projection: { _id: 1 } }
      );
    return profile?._id;
  } catch {
    return null;
  }
}

/**
 * Forces the `student` query param to the student's Student-profile ObjectId.
 * Use before any GET endpoint that accepts a ?student filter.
 */
export const scopeStudentRead = async (req, _res, next) => {
  if (req.user.role === 'student') {
    const profileId = await getStudentProfileId(req.user.id);
    req.query.student = profileId ? profileId.toString() : req.user.id;
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
    const course = await mongoose.connection.db.collection('courses').findOne({
      teacher: req.user.id,
      _id: new mongoose.Types.ObjectId(courseId),
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
    const course = await mongoose.connection.db.collection('courses').findOne({
      teacher: req.user.id,
      _id: new mongoose.Types.ObjectId(courseId),
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
