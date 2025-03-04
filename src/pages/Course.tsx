import React, { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import ProductOne from '../images/product/product-01.png';
import PlaceholderImg from '../images/placeholder-image.png';
import { Link, useNavigate } from 'react-router-dom';
import { AddCourseDto, CourseDto, UpdateCourseDto } from '../dto/CourseDto';
import api from '../api/api';

const Course: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CourseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateCourseDto>(
    {} as UpdateCourseDto,
  );
  const [addFormData, setAddFormData] = useState<AddCourseDto>({
    code: '',
    name: '',
  });

  const fetchData = async () => {
    try {
      const response = await api.get<CourseDto[]>('course');
      setData(response.data);
    } catch (error) {
      console.log('Error Fetching Data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (course: CourseDto) => {
    setSelectedCourse(course);
    setEditFormData({ ...course });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setEditFormData({} as CourseDto);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setAddFormData({} as CourseDto);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({} as CourseDto);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      console.error('Tidak ada course yang dipilih untuk diedit.');
      return;
    }

    try {
      const response = await api.put<UpdateCourseDto>(
        `/course/${selectedCourse.id}`,
        editFormData,
      );
      console.log('Response:', response.data);

      setEditFormData({} as CourseDto);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post<AddCourseDto>('/course', addFormData);
      console.log('Response:', response.data);

      setAddFormData({ code: '', name: '' });
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/course/${id}`);
      console.log('Response : ', response.data);

      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const columns = [
    // {
    //   data: 'image',
    //   title: 'Image',
    //   render: (data: string) =>
    //     `<img src="${ProductOne}" alt="Course" class="w-12 h-12 rounded-md" />`,
    //   orderable: false,
    //   searchable: false,
    // },
    { data: 'name', title: 'Name' },
    { data: 'code', title: 'Code' },
    // { data: 'students', title: 'Students', searchable: false },
    // { data: 'chapters', title: 'Chapters', searchable: false },
    {
      data: 'createdAt',
      title: 'Created At',
      render: function (data: string | null) {
        if (!data) return '-';
        const date = new Date(data);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      createdCell: (cell: HTMLTableCellElement, _: any, rowData: CourseDto) => {
        cell.innerHTML = '';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex space-x-2';

        const createButton = (
          buttonColor: string,
          svgPath: string,
          onClick: () => void,
        ) => {
          const button = document.createElement('button');
          button.className = `px-4.5 py-2.5 ${buttonColor} text-white rounded-md`; // Adjust styles as needed

          const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
          );
          svg.setAttribute('viewBox', '0 0 512 512');
          svg.setAttribute('width', '20');
          svg.setAttribute('height', '20');
          svg.setAttribute('fill', 'white');
          svg.innerHTML = svgPath;

          button.appendChild(svg);
          button.onclick = onClick;
          return button;
        };

        const manageButton = createButton(
          'bg-primary',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/></svg>`, // Example SVG for view
          () => navigate(`/usercourse/${rowData.id}`),
        );

        const editButton = createButton(
          'bg-warning',
          `<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>`,
          () => handleOpenModal(rowData),
        );

        const deleteButton = createButton(
          'bg-danger',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`, // Example SVG for view
          () => handleDelete(rowData.id),
        );

        const infoButton = createButton(
          'bg-success',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/></svg>`,
          () => navigate(`/course/${rowData.id}`),
        );

        buttonContainer.appendChild(infoButton);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(manageButton);
        buttonContainer.appendChild(deleteButton);

        cell.appendChild(buttonContainer);
      },
    },
  ];

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h1 className="text-2xl font-bold pb-5">Course Management</h1>
      <hr />
      <div className="text-end mt-6">
        <button // Tombol "Add Course" yang sudah diperbaiki
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
        >
          Add Course
        </button>
      </div>
      <div className="max-w-full overflow-x-auto ">
        <DataTable
          data={data}
          columns={columns}
          className="display nowrap w-full"
        />
      </div>

      {isAddModalOpen && ( // Add Modal Conditional Rendering
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            style={{ width: '800px', maxWidth: '90%' }}
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Course
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <AddCourseModal
                onClose={handleCloseAddModal}
                data={addFormData}
                onChange={handleInputChange}
                onSubmit={handleAddFormSubmit}
              />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            style={{ width: '800px', maxWidth: '90%' }}
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit Course
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <EditCourseModal
                onClose={handleCloseModal}
                data={editFormData}
                onChange={handleInputChange}
                onSubmit={handleEditFormSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ModalProps<T extends UpdateCourseDto | AddCourseDto> {
  onClose: () => void;
  data: T
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditCourseModal: React.FC<ModalProps<UpdateCourseDto>> = ({
  onClose,
  data,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="mb-3 block text-black dark:text-white">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={onChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="code" className="mb-3 block text-black dark:text-white">
          Code
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={data.code}
          onChange={onChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="mb-3 block text-black dark:text-white"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
        />
        <img
          src={PlaceholderImg}
          alt="Placeholder"
          className="w-full h-60 object-cover rounded-lg mt-5"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const AddCourseModal: React.FC<ModalProps<AddCourseDto>> = ({
  onClose,
  data,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {/* ... (Your form fields, similar to EditCourseModal) */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-3 block text-black dark:text-white">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={onChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="code" className="mb-3 block text-black dark:text-white">
          Code
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={data.code}
          onChange={onChange}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="mb-3 block text-black dark:text-white"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
        />
        <img
          src={PlaceholderImg}
          alt="Placeholder"
          className="w-full h-60 object-cover rounded-lg mt-5"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Course;
