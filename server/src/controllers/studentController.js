/**
 * controllers/studentController.js — Student profile endpoints.
 *
 * CRUD for student profiles. Role-based scoping applied:
 * - Students can only view their own profile.
 * - Teachers/admins can manage all students.
 */

import Student from '../models/Student.js';

const PAGE_SIZE = 20;

export const getStudents = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id }).lean();
      if (!student) return res.json({ success: true, data: [], meta: { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 } });
      filter._id = student._id;
    }

    if (req.query.programme) filter.programme = req.query.programme;
    if (req.query.enrollmentYear) filter.enrollmentYear = Number(req.query.enrollmentYear);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .sort('-createdAt')
        .lean(),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: students,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email')
      .lean();

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (req.user.role === 'student') {
      const ownProfile = await Student.findOne({ user: req.user.id }).lean();
      if (!ownProfile || ownProfile._id.toString() !== student._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only view your own profile' });
      }
    }

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: { message: 'Student removed' } });
  } catch (error) {
    next(error);
  }
};
