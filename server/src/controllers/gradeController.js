/**
 * controllers/gradeController.js — Grade management endpoints.
 *
 * Allows teachers/admins to record and update grades, and
 * students to view their own grades.
 */

import Grade from '../models/Grade.js';

export const getGrades = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.term) filter.term = req.query.term;

    const grades = await Grade.find(filter)
      .populate('student', 'studentId')
      .populate('recordedBy', 'name');
    res.json(grades);
  } catch (error) {
    next(error);
  }
};

export const getGradeById = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json(grade);
  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const grade = await Grade.create({ ...req.body, recordedBy: req.user.id });
    res.status(201).json(grade);
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json(grade);
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade removed' });
  } catch (error) {
    next(error);
  }
};
