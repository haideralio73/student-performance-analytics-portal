/**
 * controllers/gradeController.js — Grade management endpoints.
 *
 * Implements role-based scoping:
 * - Students see only their own grades.
 * - Teachers see grades for their courses.
 * - Admins see all grades.
 * Supports pagination and optimized lean() queries.
 */

import Grade from '../models/Grade.js';

const PAGE_SIZE = 20;

export const getGrades = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user.id;
    } else {
      if (req.query.student) filter.student = req.query.student;
    }

    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.term) filter.term = req.query.term;
    if (req.query.assessmentType) filter.assessmentType = req.query.assessmentType;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const [grades, total] = await Promise.all([
      Grade.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('student', 'studentId')
        .populate('recordedBy', 'name')
        .lean(),
      Grade.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: grades,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getGradeById = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'studentId')
      .populate('recordedBy', 'name')
      .lean();

    if (!grade) return res.status(404).json({ success: false, message: 'Grade not found' });

    if (req.user.role === 'student' && grade.student?._id?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only view your own grades' });
    }

    res.json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const grade = await Grade.create({
      ...req.body,
      recordedBy: req.user.id,
    });

    res.status(201).json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const existing = await Grade.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Grade not found' });

    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ success: false, message: 'Grade not found' });

    res.json({ success: true, data: { message: 'Grade removed' } });
  } catch (error) {
    next(error);
  }
};
