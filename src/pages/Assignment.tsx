import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Link } from 'react-router-dom';

interface AssignmentData {
  id: string;
  material: string;
  course: string;
  created_at: string;
  participant: string;
  action: string;
}

const Assignment: React.FC = () => {
  const columns: TableColumn<AssignmentData>[] = [
    {
      name: 'ID',
      selector: (row: AssignmentData) => row.id,
    },
    {
      name: 'Material',
      selector: (row: AssignmentData) => row.material,
    },
    {
      name: 'Course',
      selector: (row: AssignmentData) => row.course,
    },
    {
      name: 'Created At',
      selector: (row: AssignmentData) => row.created_at,
    },
    {
      name: 'Participant',
      selector: (row: AssignmentData) => row.participant,
    },
    {
      name: 'Action',
      selector: (row: AssignmentData) => row.action,
      cell: (row: AssignmentData) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
      ),
    },
  ];

  const data: AssignmentData[] = [
    {
      id: '0001',
      material: 'Tugas Week 1',
      course: 'Interaksi Manusia Komputer',
      created_at: '04 September 2024',
      participant: '10',
      action: 'Edit',
    },
    {
      id: '0002',
      material: 'Tugas Week 2',
      course: 'Interaksi Manusia Komputer',
      created_at: '12 September 2024',
      participant: '11',
      action: 'Edit',
    },
    {
      id: '0003',
      material: 'Tugas Week 3',
      course: 'Interaksi Manusia Komputer',
      created_at: '20 September 2024',
      participant: '23',
      action: 'Edit',
    },
    // Add more courses as needed
  ];

  const [records, setRecords] = useState<AssignmentData[]>(data);

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const newData = data.filter((row) => {
      return (
        row.id.toLowerCase().includes(event.target.value.toLowerCase()) || // Filter by course name
        row.material.toLowerCase().includes(event.target.value.toLowerCase()) // Or filter by course ID
      );
    });
    setRecords(newData);
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl text-primary font-bold">
          Assignment Management
        </h1>
        <Link
          to="#"
          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
        >
          Add Assignment
        </Link>
      </div>
      <div className="text-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          className="border p-2 rounded"
        />
      </div>
      <DataTable
        columns={columns}
        data={records}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default Assignment;
