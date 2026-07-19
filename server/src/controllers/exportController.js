/**
 * controllers/exportController.js — CSV/PDF report export.
 *
 * GET /api/export/:resource?format=csv&filters...
 * Generates downloadable CSV files for grades, attendance,
 * students, and users with optional filters.
 */

import mongoose from 'mongoose';
import logger from '../config/logger.js';

const formatCSVRow = (row) => {
  return Object.values(row)
    .map((v) => {
      const str = v === null || v === undefined ? '' : String(v);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    })
    .join(',');
};

const buildCSV = (headers, rows) => {
  return [headers.join(','), ...rows.map(formatCSVRow)].join('\n');
};

const EXPORTERS = {
  grades: {
    headers: ['Subject', 'Assessment', 'Type', 'Score', 'MaxScore', 'Percentage', 'Term', 'StudentID', 'Date'],
    async fetch(req) {
      const filter = {};
      if (req.query.student) filter.student = req.query.student;
      if (req.query.subject) filter.subject = req.query.subject;
      if (req.query.term) filter.term = req.query.term;
      if (req.query.assessmentType) filter.assessmentType = req.query.assessmentType;
      if (req.query.dateFrom || req.query.dateTo) {
        filter.date = {};
        if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
        if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo);
      }

      const docs = await mongoose.connection.db
        .collection('grades')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return docs.map((g) => ({
        Subject: g.subject,
        Assessment: g.assessmentName || '',
        Type: g.assessmentType,
        Score: g.score,
        MaxScore: g.maxScore,
        Percentage: `${Math.round((g.score / g.maxScore) * 100)}%`,
        Term: g.term,
        StudentID: g.student?.toString() || '',
        Date: g.date ? new Date(g.date).toISOString().split('T')[0] : '',
      }));
    },
  },

  attendance: {
    headers: ['Date', 'Subject', 'Status', 'StudentID', 'MarkedBy'],
    async fetch(req) {
      const filter = {};
      if (req.query.student) filter.student = req.query.student;
      if (req.query.subject) filter.subject = req.query.subject;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.dateFrom || req.query.dateTo) {
        filter.date = {};
        if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
        if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo);
      }

      const docs = await mongoose.connection.db
        .collection('attendances')
        .find(filter)
        .sort({ date: -1 })
        .toArray();

      return docs.map((r) => ({
        Date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
        Subject: r.subject,
        Status: r.status,
        StudentID: r.student?.toString() || '',
        MarkedBy: r.markedBy?.toString() || '',
      }));
    },
  },

  students: {
    headers: ['StudentID', 'Name', 'Programme', 'EnrollmentYear', 'GuardianName', 'GuardianPhone'],
    async fetch(req) {
      const filter = {};
      if (req.query.programme) filter.programme = req.query.programme;
      if (req.query.enrollmentYear) filter.enrollmentYear = Number(req.query.enrollmentYear);

      const docs = await mongoose.connection.db
        .collection('students')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return docs.map((s) => ({
        StudentID: s.studentId,
        Name: s.user?.name || '',
        Programme: s.programme,
        EnrollmentYear: s.enrollmentYear,
        GuardianName: s.guardian?.name || '',
        GuardianPhone: s.guardian?.phone || '',
      }));
    },
  },

  users: {
    headers: ['Name', 'Email', 'Role', 'Joined'],
    async fetch(req) {
      const filter = {};
      if (req.query.role) filter.role = req.query.role;

      const docs = await mongoose.connection.db
        .collection('users')
        .find(filter)
        .project({ password: 0 })
        .sort({ createdAt: -1 })
        .toArray();

      return docs.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
      }));
    },
  },
};

export const exportCSV = async (req, res, next) => {
  try {
    const resource = req.params.resource;
    const exporter = EXPORTERS[resource];

    if (!exporter) {
      return res.status(400).json({
        success: false,
        message: `Invalid resource. Must be one of: ${Object.keys(EXPORTERS).join(', ')}`,
      });
    }

    const rows = await exporter.fetch(req);

    if (!rows.length) {
      return res.status(200).json({
        success: true,
        message: 'No data found for the given filters',
        data: [],
      });
    }

    const csv = buildCSV(exporter.headers, rows);
    const filename = `${resource}-export-${new Date().toISOString().split('T')[0]}.csv`;

    logger.info(`CSV export: ${resource} — ${rows.length} rows`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportJSON = async (req, res, next) => {
  try {
    const resource = req.params.resource;
    const exporter = EXPORTERS[resource];

    if (!exporter) {
      return res.status(400).json({
        success: false,
        message: `Invalid resource. Must be one of: ${Object.keys(EXPORTERS).join(', ')}`,
      });
    }

    const data = await exporter.fetch(req);

    logger.info(`JSON export: ${resource} — ${data.length} rows`);

    res.json({
      success: true,
      data,
      meta: { total: data.length },
    });
  } catch (error) {
    next(error);
  }
};
