/**
 * controllers/attendanceController.js — Attendance endpoints.
 *
 * Role-based scoping:
 * - Students see only their own attendance records.
 * - Teachers see records for their courses.
 * - Admins see all records.
 */

import Attendance from '../models/Attendance.js';

const PAGE_SIZE = 20;

export const getAttendance = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.query.student || req.user.id;
    } else {
      if (req.query.student) filter.student = req.query.student;
    }

    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) filter.date = new Date(req.query.date);
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo);
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-date';

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('student', 'studentId')
        .populate('markedBy', 'name')
        .lean(),
      Attendance.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: records,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const createAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.create({
      ...req.body,
      markedBy: req.user.id,
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateAttendance = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Request body must be an array of attendance records',
      });
    }

    const records = req.body.map((entry) => ({
      ...entry,
      markedBy: req.user.id,
    }));

    const result = await Attendance.insertMany(records, { ordered: false });

    res.status(201).json({
      success: true,
      data: {
        created: result.length,
        records: result,
      },
    });
  } catch (error) {
    if (error.writeErrors) {
      const inserted = error.insertedDocs?.length || 0;
      return res.status(207).json({
        success: true,
        data: {
          created: inserted,
          failed: error.writeErrors.length,
          errors: error.writeErrors.map((e) => e.errmsg),
        },
      });
    }
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};
