import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Link } from 'react-router-dom';

// Interface untuk data soal
interface Question {
  type: 'multipleChoice' | 'essay';
  questionText: string;
  options?: string[]; // Opsi untuk pilihan ganda
  correctAnswer?: string; // Jawaban benar untuk pilihan ganda
}

const Assessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestionType, setNewQuestionType] = useState<
      'multipleChoice' | 'essay'
    >('multipleChoice');
  
    const handleSaveQuestion = (questionData: Question) => {
      setQuestions([...questions, questionData]);
    };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
      <h1 className="text-2xl font-bold pb-5">Assesment Management</h1>
      <hr />
      {/* Daftar Soal */}
      <div className="mt-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md p-4 mb-4"
          >
            <h3 className="text-lg font-semibold mb-2">Soal {index + 1}</h3>
            <p>
              Tipe:{' '}
              {question.type === 'multipleChoice' ? 'Pilihan Ganda' : 'Esai'}
            </p>
            {question.type === 'multipleChoice' ? (
              <div>
                <p className="py-3 text-lg text-boxdark-2">
                  {question.questionText}
                </p>
                {question.options?.map((option, i) => (
                  <div key={i} className="my-2">
                    <input
                      className="mr-5 gte"
                      type="radio"
                      name={`answer-${index}`}
                      value={option}
                    />
                    {option}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="py-3 text-lg text-boxdark-2">
                  {question.questionText}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Buat Soal Baru */}
      <div className="border border-gray-300 rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Buat Soal Baru</h3>

        {/* Pilih Tipe Soal */}
        <div className="mb-4 relative">
          <label
            htmlFor="questionType"
            className="block text-gray-700 font-medium"
          >
            Tipe Soal:
          </label>
          <div className="relative mt-3">
            <select
              id="questionType"
              className="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 px-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={newQuestionType}
              onChange={(e) =>
                setNewQuestionType(e.target.value as 'multipleChoice' | 'essay')
              }
            >
              <option value="multipleChoice">Pilihan Ganda</option>
              <option value="essay">Esai</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06-.02L10 10.69l3.71-3.5a.75.75 0 011.04 1.08l-4.24 4a.75.75 0 01-1.04 0l-4.24-4a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Form Pilihan Ganda atau Esai */}
        {newQuestionType === 'multipleChoice' ? (
          <MultipleChoiceForm onSave={handleSaveQuestion} />
        ) : (
          <EssayForm onSave={handleSaveQuestion} />
        )}
      </div>
    </div>
  );
};

// Contoh untuk MultipleChoiceForm
const MultipleChoiceForm: React.FC<{
  onSave: (questionData: Question) => void;
}> = ({ onSave }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '', '']); // Default 4 opsi
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questionData: Question = {
      type: 'multipleChoice',
      questionText,
      options,
      correctAnswer,
    };
    onSave(questionData);
    setQuestionText('');
    setOptions(['', '', '', '', '']);
    setCorrectAnswer('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... input untuk pertanyaan, pilihan, dan jawaban */}
      <input
        className="w-full p-4 mb-6 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Pertanyaan"
      />
      {options.map((option, index) => (
        <div key={index} className="my-2">
          <input
            className="mr-5"
            type="radio"
            name="correctAnswer"
            value={option}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
          <input
            className="w-100"
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Opsi ${index + 1}`}
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
      >
        Simpan Soal
      </button>
    </form>
  );
};

// Contoh untuk EssayForm
const EssayForm: React.FC<{ onSave: (questionData: Question) => void }> = ({
  onSave,
}) => {
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questionData: Question = {
      type: 'essay',
      questionText,
    };
    onSave(questionData);
    setQuestionText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="w-full p-4 mb-6 w-full p-4 mb-6 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Pertanyaan Esai"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Simpan Soal
      </button>
    </form>
  );
};

export default Assessment;
