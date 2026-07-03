/**
 * controllers/attendanceController.js — Attendance endpoints.
 *
 * Record, query, and update daily attendance entries.
 * Supports filtering by student, date range, and subject.
 */

import Attendance from '../models/Attendance.js';

export const getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.date) filter.date = req.query.date;

    const records = await Attendance.find(filter)
      .populate('student', 'studentId')
      .populate('markedBy', 'name');
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const createAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.create({ ...req.body, markedBy: req.user.id });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const bulkCreateAttendance = async (req, res, next) => {
  try {
    const records = req.body.map((entry) => ({ ...entry, markedBy: req.user.id }));
    const result = await Attendance.insertMany(records, { ordered: false });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    next(error);
  }
};
