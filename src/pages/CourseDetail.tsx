import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductOne from '../images/product/product-01.png';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl text-primary font-bold">Edit Course - {id}</h1>
      </div>
      <div className="bg-white p-3 mt-7">
        <div>
          <h1 className="text-xl text-boxdark-2 font-bold">Name</h1>
          <input
            type="text"
            className="w-full p-2 mt-2 border rounded"
            placeholder="Enter course name"
          />
        </div>
        <div className="mt-4">
          <h1 className="text-xl text-boxdark-2 font-bold">Image</h1>
          <img
            src={ProductOne}
            alt="Course"
            className="w-50 h-50 object-cover rounded my-4"
          />
          <input
            type="file"
            className="w-full p-2 mt-2 border rounded"
            placeholder="Enter course name"
          />
        </div>
        <div className="mt-4">
          <h1 className="text-xl text-boxdark-2 font-bold">Code</h1>
          <input
            type="text"
            className="w-full p-2 mt-2 border rounded"
            placeholder="Enter course code"
          />
        </div>
        <div className="mt-4">
          <h1 className="text-xl text-boxdark-2 font-bold">Instructor</h1>
          <select className="w-full p-2 mt-2 border rounded">
            <option value="">Select an instructor</option>
            <option value="instructor1">Instructor 1</option>
            <option value="instructor2">Instructor 2</option>
            <option value="instructor3">Instructor 3</option>
          </select>
        </div>
        <div className="mt-4">
          <h1 className="text-xl text-boxdark-2 font-bold">Students</h1>
          <div className="mt-2">
            <Link
              to={`/user-course/${id}`}
              className="inline-flex items-center justify-center w-full rounded-md px-3 py-2 bg-primary text-white font-medium hover:bg-opacity-90"
            >
              Assign Students
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-xl text-boxdark-2 font-bold">Chapter</h1>
          <div className="mt-2">
            <Link
              to={`/user-course/${id}`}
              className="inline-flex items-center justify-center w-full rounded-md px-3 py-2 bg-primary text-white font-medium hover:bg-opacity-90"
            >
              Add Chapter
            </Link>
          </div>
        </div>
        <div className='text-end'>
          <Link
            to="#"
            className="inline-flex items-center justify-center rounded-md mt-5 px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
          >
            Save Changes
          </Link>
        </div>
      </div>
    </div>

    // <div className="p-6">
    //   <h1 className="text-2xl font-bold text-primary">Edit Course - {id}</h1>
    //   <p>Here you can edit the details of the course with ID: {id}.</p>
    //   {/* Tambahkan form edit course di sini */}
    // </div>
  );
};

export default CourseDetail;
