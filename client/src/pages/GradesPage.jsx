/**
 * pages/GradesPage.jsx — Grade management page.
 *
 * Displays grades in a filterable table. Teachers/admins can
 * record new assessments; students see their own results.
 */

import { useFetch } from '../hooks/useFetch';
import DataTable from '../components/shared/DataTable';

const columns = [
  { key: 'subject', label: 'Subject' },
  { key: 'assessmentType', label: 'Type' },
  { key: 'score', label: 'Score', render: (val, row) => `${val}/${row.maxScore}` },
  { key: 'term', label: 'Term' },
];

export default function GradesPage() {
  const { data, loading } = useFetch('/grades');

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Grades</h2>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
