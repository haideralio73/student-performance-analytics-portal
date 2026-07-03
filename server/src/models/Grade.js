/**
 * models/Grade.js — Grade / assessment schema.
 *
 * Records an individual assessment result for a student in a
 * specific subject, including score, max score, term, and type
 * (exam, quiz, assignment, project).
 */

import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    maxScore: { type: Number, required: true, default: 100 },
    term: { type: String, required: true },
    assessmentType: {
      type: String,
      enum: ['exam', 'quiz', 'assignment', 'project'],
      required: true,
    },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Grade', gradeSchema);
