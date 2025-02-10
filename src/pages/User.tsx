import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Link } from 'react-router-dom';

interface UserData {
  username: string;
  name: string;
  user_role: string;
  student_id: string;
  instructor_id: string;
  action: string;
}

const User: React.FC = () => {
  const columns: TableColumn<UserData>[] = [
    {
      name: 'Name',
      selector: (row: UserData) => row.name,
    },
    {
      name: 'Username',
      selector: (row: UserData) => row.username,
    },
    {
      name: 'Role',
      selector: (row: UserData) => row.user_role,
    },
    {
      name: 'Student ID',
      selector: (row: UserData) => row.student_id,
    },
    {
      name: 'Instructor ID',
      selector: (row: UserData) => row.instructor_id,
    },
    {
      name: 'Action',
      selector: (row: UserData) => row.action,
      cell: (row: UserData) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
      ),
    },
  ];

  const data: UserData[] = [
    {
      username: 'ifs21028',
      name: 'Rafael Manurung',
      user_role: 'Student',
      student_id: '11S21028',
      instructor_id: '-',
      action: 'Edit'
    },
    {
      username: 'ifs21003',
      name: 'Benhard Yudha',
      user_role: 'Student',
      student_id: '11S21003',
      instructor_id: '-',
      action: 'Edit'
    },
    {
      username: 'archico.semb',
      name: 'Archico Sembiring',
      user_role: 'Instructor',
      student_id: '-',
      instructor_id: '11S21011',
      action: 'Edit'
    },
    // Add more courses as needed
  ];

  const [records, setRecords] = useState<UserData[]>(data);

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const newData = data.filter((row) => {
      return (
        row.student_id.toLowerCase().includes(event.target.value.toLowerCase()) || 
        row.instructor_id.toLowerCase().includes(event.target.value.toLowerCase()) || 
        row.name.toLowerCase().includes(event.target.value.toLowerCase()) 
      );
    });
    setRecords(newData);
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl text-primary font-bold">
          User Management
        </h1>
        <Link
          to="#"
          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
        >
          Add User
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

export default User;
