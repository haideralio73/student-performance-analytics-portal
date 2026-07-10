/**
 * models/Grade.js — Grade / assessment schema.
 *
 * Records an individual assessment result for a student in a
 * specific subject. Includes compound indexes for common queries.
 */

import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
    },
    maxScore: {
      type: Number,
      required: true,
      default: 100,
      min: [1, 'Max score must be at least 1'],
    },
    term: { type: String, required: [true, 'Term is required'] },
    assessmentType: {
      type: String,
      enum: {
        values: ['exam', 'quiz', 'assignment', 'project'],
        message: '{VALUE} is not a valid assessment type',
      },
      required: [true, 'Assessment type is required'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
gradeSchema.index({ student: 1, subject: 1 });
gradeSchema.index({ subject: 1, assessmentType: 1 });
gradeSchema.index({ term: 1, createdAt: -1 });

export default mongoose.model('Grade', gradeSchema);
