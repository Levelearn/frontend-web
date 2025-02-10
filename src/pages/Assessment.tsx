import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Link } from 'react-router-dom';

interface AssessmentData {
  id: string;
  material: string;
  course: string;
  created_at: string;
  type: string;
  action: string;
}

const Assessment: React.FC = () => {
  const columns: TableColumn<AssessmentData>[] = [
    {
      name: 'ID',
      selector: (row: AssessmentData) => row.id,
    },
    {
      name: 'Material',
      selector: (row: AssessmentData) => row.material,
    },
    {
      name: 'Course',
      selector: (row: AssessmentData) => row.course,
    },
    {
      name: 'Created At',
      selector: (row: AssessmentData) => row.created_at,
    },
    {
      name: 'Type',
      selector: (row: AssessmentData) => row.type,
    },
    {
      name: 'Action',
      selector: (row: AssessmentData) => row.action,
      cell: (row: AssessmentData) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
      ),
    },
  ];

  const data: AssessmentData[] = [
    {
      id: '0001',
      material: 'Kuis Week 1',
      course: 'Interaksi Manusia Komputer',
      created_at: '04 September 2024',
      type: 'True/False',
      action: 'Edit',
    },
    {
      id: '0002',
      material: 'Kuis Week 2',
      course: 'Interaksi Manusia Komputer',
      created_at: '12 September 2024',
      type: 'Multiple Choice',
      action: 'Edit',
    },
    {
      id: '0003',
      material: 'Kuis Week 3',
      course: 'Interaksi Manusia Komputer',
      created_at: '20 September 2024',
      type: 'Multiple Choice',
      action: 'Edit',
    },
    // Add more courses as needed
  ];

  const [records, setRecords] = useState<AssessmentData[]>(data);

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
          Assessment Management
        </h1>
        <Link
          to="#"
          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
        >
          Add Assessment
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

export default Assessment;
