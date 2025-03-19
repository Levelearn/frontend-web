import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { CourseDto } from '../dto/CourseDto';
import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import { AssignmentDto } from '../dto/AssignmentDto';
import { AssessResponseDto } from '../dto/AssessResponseDto';

const AssignmentResponse = () => {
  const { courseId, assignId } = useParams();
  const [dataCourse, setDataCourse] = useState<CourseDto>();
  const [dataAssignResponse, setDataAssignResponse] = useState<AssessResponseDto[]>([]);

  const fetchCourse = async () => {
    try {
      const response = await api.get<CourseDto>(`/course/${courseId}`);
      setDataCourse(response.data);
    } catch (error) {
      console.error('Error while fetching course', error);
    }
  };

  const fetchAssign = async () => {
    try {
      const response = await api.get<AssignmentDto>(`/assignment/${assignId}`);
      fetchAssignResponse(response.data.chapterId).then;
    } catch (error) {
      console.error('Error while fetching assignment', error);
    }
  }

  const fetchAssignResponse = async(id: number) => {
    try {
      const response = await  api.get<AssessResponseDto[]>(`/chapter/${id}/userchapter`);
      setDataAssignResponse(response.data);
    } catch (error) {
      console.error('Error while fetching assignment response', error);
    }
  }

  useEffect(() => {
    fetchCourse();
    fetchAssign();
  }, []);

  const columns = [
      { data: 'user.name', title: 'Name' },
      {
        data: 'user.studentId',
        title: 'Student ID',
      },
      {
        data: 'assignmentDone',
        title: 'Status',
        createdCell: (cell: HTMLTableCellElement, cellData: string) => {
          cell.textContent = !!cellData === true ? 'FINISHED' : 'UNFINISHED'; 
        },
      },
      {
        data: null,
        title: 'File',
        orderable: false,
        searchable: false,
        createdCell: (cell: HTMLTableCellElement, _: any, rowData: AssessResponseDto) => {
          cell.innerHTML = '';
  
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'flex space-x-2';
  
          const createButton = (
            buttonColor: string,
            svgPath: string,
            title: string,
            onClick: () => void,
          ) => {
            const button = document.createElement('button');
            button.className = `px-4.5 py-2.5 ${buttonColor} text-white rounded-md`;
            button.title = title;
  
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
  
          const infoButton = createButton(
            'bg-success',
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/></svg>`,
            'Info',
            () => {
              if (rowData.submission) {
                window.open(rowData.submission, '_blank'); 
              } else {
                alert("No Submission Found");
              }
            },
          );
  
          buttonContainer.appendChild(infoButton);
  
          cell.appendChild(buttonContainer);
        },
      },
    ];

  return (
    <div>
      <div className="pb-6 text-xl font-semibold">
        <Link to="/course" className="text-blue-500 hover:text-blue-400">
          Course
        </Link>{' '}
        &gt;{' '}
        <Link
          to={`/course/${courseId}`}
          className="text-blue-500 hover:text-blue-400"
        >
          {dataCourse?.name}
        </Link>{' '}
        &gt;{' '}
        <Link
          to={`/course/${courseId}/assignment/${assignId}`}
          className="text-blue-500 hover:text-blue-400"
        >
          Assignment
        </Link>{' '}
        &gt; Response
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
        {/* <style>{selectStyle}</style> */}
        <h1 className="text-2xl font-bold pb-5">
          Assignment Response Management
        </h1>
        <hr />
        <div className="max-w-full overflow-x-auto ">
          <DataTable
            data={dataAssignResponse}
            columns={columns}
            className="display nowrap w-full"
            options={{
              order: [[5, 'desc']],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignmentResponse;
