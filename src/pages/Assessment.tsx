import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AssessmentDto, Question } from '../dto/AssessmentDto';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [instruction, setInstruction] = useState<string>('');
  const [assessId, setAssessId] = useState<number>();
  const [assessmentExist, setAssessmentExist] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<string>('MC');

  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newOptionText, setNewOptionText] = useState<string>('');
  const [newAnswerText, setNewAnswerText] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AssessmentDto>(
        `/chapter/${id}/assessments`,
      );
      console.log(response.data);

      if (response.data && response.data.id) {
        setInstruction(response.data.instruction);
        setAssessId(response.data.id);
        if (response.data.questions) {
          try {
            const parsedQuestions: Question[] = JSON.parse(
              response.data.questions,
            );
            setQuestions(parsedQuestions);
            setAssessmentExist(true);
          } catch (parseError) {
            console.error('Error parsing questions:', parseError);
            setError('Gagal memproses data pertanyaan.');
          }
        } else {
          setQuestions([]);
          setAssessmentExist(true);
        }
      } else {
        setAssessmentExist(false);
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError('Gagal memuat assessment. Silakan coba lagi.');
      setAssessmentExist(false); // Set assessmentExist ke false jika error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddOption = () => {
    if (newOptionText.trim() !== '') {
      setCurrentOptions([...currentOptions, newOptionText]);
      setNewOptionText('');
    }
  };

  const handleSaveQuestion = async () => {
    const newQuestion: Question = {
      question: newQuestionText,
      options: questionType === 'MC' ? currentOptions : undefined,
      answer: questionType === 'MC' ? newAnswerText : '',
      type: questionType as 'MC' | 'EY',
    };
    // console.log(JSON.stringify([...questions, newQuestion]));
    // setQuestions([...questions, newQuestion]);
    try {
      const response = await api.put(`/assessment/${assessId}`, {
        questions: JSON.stringify([...questions, newQuestion]),
      });
      fetchData();
    } catch (err) {
      console.error('Error while updating questions: ', err);
    }

    setNewQuestionText('');
    setCurrentOptions([]);
    setNewAnswerText('');
  };

  const handleCreateAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/assessment', {
        // Perubahan URL
        chapterId: Number(id), // Pastikan id diubah ke integer
        instruction: instruction,
        questions: JSON.stringify(questions),
      });
      fetchData();
    } catch (createError) {
      console.error('Error creating assessment:', createError);
      setError('Gagal membuat assessment. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
      <h1 className="text-2xl font-bold pb-5">Assessment Management</h1>
      <hr />
      {assessmentExist ? (
        <div className="mt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <strong className="grid content-center">Instruction</strong>
              <button className="px-4 py-2 bg-warning text-white rounded-md">
                <svg viewBox="0 0 512 512" width="20" height="20" fill="white">
                  <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                </svg>
              </button>
            </div>
            <hr className="my-2" />
            {instruction}
          </div>
          {questions.length > 0 && (
            <div className='border rounded-lg p-4 mt-4'>
              {questions.map((q, index) => (
                <div key={index} className="">
                  {index !== 0 && (
                    <hr className='my-2'/>
                  )}
                  <div className="flex justify-between">
                    <p className="grid content-center">
                      <strong>Pertanyaan {index + 1}</strong>
                    </p>
                    <button
                      className="bg-warning px-4 py-2 rounded-md"
                      onClick={() => navigate(`/edit-question/${id}/${index}`)}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        width="20"
                        height="20"
                        fill="white"
                      >
                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                      </svg>
                    </button>
                  </div>
                  <p>{q.question}</p>
                  <p className='mt-2'>
                    <strong>Tipe</strong> <br />
                    {q.type === 'MC' ? 'Pilihan Berganda' : 'Esai'}
                  </p>
                  {q.type === 'MC' &&
                    q.options &&
                    Array.isArray(q.options) &&
                    q.options.length > 0 && (
                      <div className='mt-2'>
                        <p>
                          <strong>Opsi</strong>
                        </p>
                        {q.options.map((option, optionIndex) => (
                          <div key={optionIndex}>• {option}</div>
                        ))}
                        <p className='mt-2'>
                          <strong>Jawaban</strong>
                          <br /> {q.answer}
                        </p>
                      </div>
                    )}
                  {q.type === 'EY' && (
                    <p className='mt-2'>
                      <strong>Jawaban (Esai)</strong>
                      <br />-
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <p className="font-semibold mb-2">Make Question</p>
            <div className="rounded-lg border p-4">
              <div className="mb-2">Type</div>
              <select
                className="w-full border rounded p-2 mb-2"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="MC">Multiple Choice</option>
                <option value="EY">Essay</option>
              </select>

              <div className="mb-2">Question</div>
              <input
                type="text"
                className="w-full border rounded p-2 mb-2"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Question...?"
              />
              {questionType === 'MC' ? (
                <div>
                  <div className="mb-2">Option</div>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                  />
                  <button
                    className="py-2 px-4 bg-slate-600 text-white rounded-md mt-2"
                    onClick={handleAddOption}
                  >
                    Save Option
                  </button>
                  <div className="mt-2">
                    {currentOptions.map((option, index) => (
                      <div key={index}>{option}</div>
                    ))}
                  </div>
                  <div className="mb-2 mt-2">Answer</div>
                  {/* <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                  /> */}
                  <select
                    className="w-full border rounded p-2"
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                  >
                    <option value="">Pilih Jawaban</option>
                    {currentOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div></div>
              )}
              <button
                className="py-2 px-4 bg-primary text-white rounded-md mt-4"
                onClick={handleSaveQuestion}
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block font-semibold mb-2 mt-4">Instruksi</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
          <button
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateAssessment}
          >
            Create Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default Assessment;
