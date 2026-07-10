/**
 * models/Attendance.js — Attendance record schema.
 *
 * Tracks daily attendance status for a student on a given
 * date and subject with compound indexes for query optimization.
 */

import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    date: { type: Date, required: [true, 'Date is required'], index: true },
    subject: { type: String, required: [true, 'Subject is required'], index: true },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent', 'late', 'excused'],
        message: '{VALUE} is not a valid attendance status',
      },
      required: [true, 'Status is required'],
      index: true,
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });
attendanceSchema.index({ subject: 1, date: -1 });
attendanceSchema.index({ date: -1 });

export default mongoose.model('Attendance', attendanceSchema);
