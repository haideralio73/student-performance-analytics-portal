/**
 * models/Student.js — Student profile schema.
 *
 * Extends the base User with academic metadata.
 */

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      index: true,
    },
    programme: {
      type: String,
      required: [true, 'Programme is required'],
      index: true,
    },
    enrollmentYear: { type: Number, required: [true, 'Enrollment year is required'] },
    guardian: {
      name: String,
      phone: String,
      email: String,
    },
  },
  { timestamps: true }
);

studentSchema.index({ programme: 1, enrollmentYear: -1 });

export default mongoose.model('Student', studentSchema);
