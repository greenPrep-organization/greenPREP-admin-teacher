import { useState, useEffect } from 'react'
import { Button, Card, Input } from 'antd'
import { useQuery } from '@tanstack/react-query'
import mockData from '@features/grading/constants/writingmockdata'
import PropTypes from 'prop-types'

const { TextArea } = Input

const STORAGE_KEY = 'writing_grading_draft'
const FEEDBACK_STORAGE_KEY = 'writing_grading_feedback'

let hasLoadedWritingDraft = false

function WritingGrade({ studentId }) {
  const [activePart, setActivePart] = useState('part1')
  const [feedbacks, setFeedbacks] = useState({})

  const { data: studentData } = useQuery({
    queryKey: ['studentData', studentId],
    queryFn: () => Promise.resolve(mockData[studentId]),
    initialData: mockData[studentId]
  })

  useEffect(() => {
    try {
      const storedFeedbacks = JSON.parse(localStorage.getItem(`${FEEDBACK_STORAGE_KEY}_${studentId}`))
      if (storedFeedbacks) {
        setFeedbacks(storedFeedbacks)
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error)
    }
  }, [studentId])

  useEffect(() => {
    try {
      localStorage.setItem(`${FEEDBACK_STORAGE_KEY}_${studentId}`, JSON.stringify(feedbacks))
    } catch (error) {
      console.error('Error saving feedbacks:', error)
    }
  }, [feedbacks, studentId])

  useEffect(() => {
    if (!hasLoadedWritingDraft && studentData) {
      try {
        const draftData = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_${studentId}`))
        if (draftData) {
          const loadedScores = {}
          draftData.forEach(({ part, scores: partScores }) => {
            partScores.forEach(({ questionIndex, score }) => {
              if (score !== null) {
                loadedScores[`${part}_question_${questionIndex}`] = score
              }
            })
          })
          hasLoadedWritingDraft = true
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [studentData, studentId])

  const handlePartChange = key => {
    setActivePart(key)
  }

  const handleFeedbackChange = (part, questionIndex, value) => {
    setFeedbacks(prevFeedbacks => ({
      ...prevFeedbacks,
      [part]: { ...prevFeedbacks[part], [questionIndex]: value }
    }))
  }

  const currentPart = studentData?.[activePart] || { questions: [], answers: [], instructions: '' }
  const questions = currentPart.questions || []
  const answers = currentPart.answers || []
  const instructions = currentPart.instructions || ''

  const renderAnswer = answer => {
    if (!answer || answer.trim() === '') {
      return <p className="m-0 italic text-gray-500">No answer submitted</p>
    }
    return <p className="m-0 whitespace-pre-wrap">{answer}</p>
  }

  return (
    <div>
      {/* Nút chọn Part */}
      <div className="mb-6 flex gap-1">
        {['part1', 'part2', 'part3', 'part4'].map(part => (
          <Button
            key={part}
            onClick={() => handlePartChange(part)}
            className={`min-w-[80px] rounded-lg border-none px-4 py-1 ${
              activePart === part ? 'bg-[#003087] text-white' : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            {`PART ${part.slice(-1)}`}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-[#003087]">{`PART ${activePart.slice(-1)}`}</h3>
          <div className="rounded-lg border border-solid border-[#003087] p-4">
            <p className="m-0 whitespace-pre-wrap text-base">{instructions}</p>
          </div>
        </div>

        {/* Questions and Feedback */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <Card className="rounded-lg border-gray-300 shadow-md">
              <p className="m-0 italic text-gray-500">No questions available</p>
            </Card>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="grid grid-cols-[1fr,1fr] gap-6">
                {/* Question and Answer */}
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
                  <div className="bg-[#E5E7EB] px-4 py-3">
                    <p className="m-0 text-base">
                      Question {index + 1}: {question}
                    </p>
                  </div>
                  <div className="space-y-4 p-4">
                    <p className="mb-2 text-base">Student Answer:</p>
                    <div className="text-black">{renderAnswer(answers[index])}</div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
                  <div className="bg-[#E5E7EB] px-4 py-3">
                    <p className="m-0 text-base">Comment</p>
                  </div>
                  <div className="p-4">
                    <TextArea
                      value={feedbacks[activePart]?.[index] || ''}
                      onChange={e => handleFeedbackChange(activePart, index, e.target.value)}
                      placeholder="Enter your feedback here..."
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      className="w-full rounded-lg border-gray-300 focus:border-[#003087] focus:shadow-none"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

WritingGrade.propTypes = {
  studentId: PropTypes.string.isRequired
}

export default WritingGrade
