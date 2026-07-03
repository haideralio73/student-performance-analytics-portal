/**
 * pages/AttendancePage.jsx — Attendance tracking page.
 *
 * Shows attendance records with date/subject filters.
 * Teachers can mark attendance; students view their record.
 */

import { useFetch } from '../hooks/useFetch';
import DataTable from '../components/shared/DataTable';

const columns = [
  { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
];

export default function AttendancePage() {
  const { data, loading } = useFetch('/attendance');

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance</h2>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
