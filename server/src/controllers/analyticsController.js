/**
 * controllers/analyticsController.js — Aggregated analytics endpoints.
 *
 * Computes and returns dashboard statistics: class averages,
 * grade distributions, attendance percentages, trend data, etc.
 */

import Grade from '../models/Grade.js';
import Attendance from '../models/Attendance.js';

export const getStudentSummary = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const grades = await Grade.find({ student: studentId });
    const avgScore =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
        : 0;

    const attendance = await Attendance.find({ student: studentId });
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const attendanceRate =
      attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

    res.json({
      averageScore: Math.round(avgScore * 100) / 100,
      totalAssessments: grades.length,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      totalSessions: attendance.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getClassOverview = async (_req, res, next) => {
  try {
    const gradeDistribution = await Grade.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $gte: [{ $divide: ['$score', '$maxScore'] }, 0.9] }, then: 'A' },
                { case: { $gte: [{ $divide: ['$score', '$maxScore'] }, 0.8] }, then: 'B' },
                { case: { $gte: [{ $divide: ['$score', '$maxScore'] }, 0.7] }, then: 'C' },
                { case: { $gte: [{ $divide: ['$score', '$maxScore'] }, 0.6] }, then: 'D' },
              ],
              default: 'F',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ gradeDistribution });
  } catch (error) {
    next(error);
  }
};
