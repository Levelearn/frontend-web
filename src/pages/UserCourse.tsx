import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Link, useParams } from 'react-router-dom';

interface UserData {
  username: string;
  name: string;
  user_role: string;
  student_id: string;
  instructor_id: string;
  selected: boolean;
}

const UserCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const columns: TableColumn<UserData>[] = [
    {
      name: 'Assign',
      cell: (row: UserData) => <input type="checkbox" checked={row.selected} />,
    },
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
  ];

  const data: UserData[] = [
    {
      username: 'ifs21028',
      name: 'Rafael Manurung',
      user_role: 'Student',
      student_id: '11S21028',
      instructor_id: '-',
      selected: false,
    },
    {
      username: 'ifs21003',
      name: 'Benhard Yudha',
      user_role: 'Student',
      student_id: '11S21003',
      instructor_id: '-',
      selected: false,
    },
    {
      username: 'ifs21011',
      name: 'Archico Sembiring',
      user_role: 'Student',
      student_id: '11S210211',
      instructor_id: '-',
      selected: false,
    },
  ];

  const [records, setRecords] = useState<UserData[]>(data);

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const newData = data.filter((row) => {
      return (
        row.student_id
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.instructor_id
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setRecords(newData);
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl text-primary font-bold">User Course - {id}</h1>
      </div>
      <div className="text-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          className="border p-2 rounded"
        />
      </div>
      <div className="bg-white p-3 mt-7">
        <DataTable
          columns={columns}
          data={records}
          pagination
          highlightOnHover
          responsive
        />
        <div className="text-end">
          <Link
            to="#"
            className="inline-flex items-center justify-center rounded-md mt-5 px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
          >
            Save Changes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCourse;
