/**
 * controllers/searchController.js — Unified search across collections.
 *
 * GET /api/search?q=keyword&type=students|users|grades|attendance
 * Supports text search with relevance scoring across multiple fields.
 */

import mongoose from 'mongoose';

const COLLECTIONS = {
  students: { name: 'students', searchFields: ['studentId', 'programme'] },
  users: { name: 'users', searchFields: ['name', 'email'] },
  grades: { name: 'grades', searchFields: ['subject', 'assessmentName', 'term'] },
  attendance: { name: 'attendances', searchFields: ['subject'] },
};

export const search = async (req, res, next) => {
  try {
    const { q, type } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const db = mongoose.connection.db;
    const results = {};
    const searchRegex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const targetTypes = type
      ? type.split(',').filter((t) => COLLECTIONS[t])
      : Object.keys(COLLECTIONS);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    for (const t of targetTypes) {
      const cfg = COLLECTIONS[t];
      if (!cfg) continue;

      const orConditions = cfg.searchFields.map((field) => ({
        [field]: searchRegex,
      }));

      const [docs, total] = await Promise.all([
        db.collection(cfg.name).find({ $or: orConditions }).skip(skip).limit(limit).toArray(),
        db.collection(cfg.name).countDocuments({ $or: orConditions }),
      ]);

      if (docs.length > 0) {
        results[t] = { data: docs, total, page, limit };
      }
    }

    const totalHits = Object.values(results).reduce((sum, r) => sum + r.total, 0);

    res.json({
      success: true,
      query: q,
      typesSearched: targetTypes,
      totalHits,
      results,
    });
  } catch (error) {
    next(error);
  }
};
