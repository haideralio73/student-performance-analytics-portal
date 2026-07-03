/**
 * models/Student.js — Student profile schema.
 *
 * Extends the base User with academic metadata: enrollment year,
 * programme, guardian info, and references to grades/attendance.
 */

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, unique: true },
    programme: { type: String, required: true },
    enrollmentYear: { type: Number, required: true },
    guardian: {
      name: String,
      phone: String,
      email: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
