/**
 * pages/StudentsPage.jsx — Student management page.
 *
 * Lists all student profiles in a searchable, sortable table.
 * Admins/teachers can add, edit, or delete students.
 */

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';

const columns = [
  { key: 'studentId', label: 'ID' },
  { key: 'name', label: 'Name', render: (_, row) => row.user?.name },
  { key: 'programme', label: 'Programme' },
  { key: 'enrollmentYear', label: 'Year' },
];

export default function StudentsPage() {
  const { data, loading } = useFetch('/students');
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Students</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          + Add Student
        </button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Student">
        <p className="text-gray-500">Student form placeholder — build out as needed.</p>
      </Modal>
    </div>
  );
}
