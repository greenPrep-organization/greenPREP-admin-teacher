import { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useQuery } from '@tanstack/react-query';
import mockData from '@features/grading/constants/writingmockdata';
import GradingScoringPanel from '@features/grading/ui/grading-scoring-panel';
import Feedback from '@features/grading/ui/feedback-grading';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'writing_grading_draft';

let hasLoadedWritingDraft = false;

function WritingGrade({ studentId }) {
  const [activePart, setActivePart] = useState('part1');
  const [scores, setScores] = useState({});

  const { data: studentData } = useQuery({
    queryKey: ['studentData', studentId],
    queryFn: () => Promise.resolve(mockData[studentId]),
    initialData: mockData[studentId],
  });

  useEffect(() => {
    if (!hasLoadedWritingDraft && studentData) {
      try {
        const draftData = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_${studentId}`));
        if (draftData) {
          const loadedScores = {};
          draftData.forEach(({ part, scores: partScores }) => {
            partScores.forEach(({ questionIndex, score }) => {
              if (score !== null) {
                loadedScores[`${part}_question_${questionIndex}`] = score;
              }
            });
          });
          setScores(loadedScores);
          hasLoadedWritingDraft = true;
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [studentData, studentId]);

  const handlePartChange = key => {
    setActivePart(key);
  };

  const handleSubmit = () => {
    // Handle submission logic here
  };

  const currentPart = studentData?.[activePart] || { questions: [], answers: [], instructions: '' };
  const questions = currentPart.questions || [];
  const answers = currentPart.answers || [];
  const instructions = currentPart.instructions || '';

  const renderAnswer = answer => {
    if (!answer || answer.trim() === '') {
      return <p className="italic text-gray-500">No answer submitted</p>;
    }
    return <p className="whitespace-pre-wrap">{answer}</p>;
  };

  return (
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 max-w-min rounded-xl border border-solid border-[#C0C0C0] px-4 py-2">
          <div className="flex flex-nowrap gap-1">
            {['part1', 'part2', 'part3', 'part4'].map(part => (
                <button
                    key={part}
                    onClick={() => handlePartChange(part)}
                    className={`whitespace-nowrap rounded-md border border-[#C0C0C0] px-2 py-1 transition-colors ${
                        activePart === part ? 'bg-[#003366] text-white' : 'bg-white text-black hover:bg-gray-50'
                    }`}
                >
                  {`Part ${part.slice(-1)}`}
                </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <Card className="mb-4 border-[#C0C0C0]">
              <div className="text-sm">
                <p className="mb-2 whitespace-pre-wrap">{instructions}</p>
                <ol className="list-decimal space-y-1 pl-6">
                  {questions.map((question, index) => (
                      <li key={index}>{question}</li>
                  ))}
                </ol>
              </div>
            </Card>

            <Card className="max-h-[400px] overflow-y-auto border-[#C0C0C0]">
              {answers.length === 0 ? (
                  <p className="italic text-gray-500">No answer submitted</p>
              ) : (
                  <ol className="list-decimal space-y-4 pl-6">
                    {answers.map((answer, index) => (
                        <li key={index}>{renderAnswer(answer)}</li>
                    ))}
                  </ol>
              )}
            </Card>
          </div>

          <GradingScoringPanel
              activePart={activePart}
              questions={questions}
              scores={scores}
              setScores={setScores}
              type="writing"
              onSubmit={handleSubmit}
              studentId={studentId}
          />
        </div>

        <div className="mt-6">
          <Feedback activePart={activePart} type="writing" />
        </div>
      </div>
  );
}

WritingGrade.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default WritingGrade;
