/**
 * services/analyticsService.js — Analytics business logic.
 *
 * Contains reusable aggregation helpers for computing averages,
 * distributions, trends, and attendance metrics that controllers
 * and scheduled jobs can invoke.
 */

export const computeAverage = (grades) => {
  if (!grades.length) return 0;
  const total = grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
  return Math.round((total / grades.length) * 100) / 100;
};

export const computeAttendanceRate = (records) => {
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === 'present').length;
  return Math.round((present / records.length) * 100 * 100) / 100;
};

export const gradeDistribution = (grades) => {
  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach((g) => {
    const pct = (g.score / g.maxScore) * 100;
    if (pct >= 90) dist.A++;
    else if (pct >= 80) dist.B++;
    else if (pct >= 70) dist.C++;
    else if (pct >= 60) dist.D++;
    else dist.F++;
  });
  return dist;
};
