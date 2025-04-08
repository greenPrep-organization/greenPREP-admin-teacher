import { useState, useEffect } from 'react'
import { Card, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import mockData from '@features/grading/constants/writingmockdata'
import PropTypes from 'prop-types'

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
    setFeedbacks(prevFeedbacks => {
      const updatedFeedbacks = { ...prevFeedbacks }
      if (!updatedFeedbacks[part]) {
        updatedFeedbacks[part] = []
      }
      updatedFeedbacks[part][questionIndex] = value
      return updatedFeedbacks
    })
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
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-2">
        <div className="flex flex-nowrap gap-1">
          {['part1', 'part2', 'part3', 'part4'].map(part => (
            <Button
              key={part}
              onClick={() => handlePartChange(part)}
              className={`rounded border border-gray-300 px-2 py-1 transition-colors ${
                activePart === part ? 'bg-blue-500 text-white' : 'bg-white text-black'
              }`}
            >
              {`Part ${part.slice(-1)}`}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex-1">
          <Card className="mb-2 max-w-[640px] flex-1 rounded border-blue-500" bodyStyle={{ padding: '12px' }}>
            <div className="text-sm">
              <p className="mb-0 whitespace-pre-wrap">{instructions}</p>
            </div>
          </Card>

          {questions.length === 0 ? (
            <Card className="rounded border-gray-300" bodyStyle={{ padding: '12px' }}>
              <p className="m-0 italic text-gray-500">No questions available</p>
            </Card>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="mb-2 flex flex-row gap-2">
                <Card className="flex-1 rounded-xl border-gray-300" bodyStyle={{ padding: 0 }}>
                  <div>
                    <p className="m-0 rounded-t-xl bg-gray-300 p-3 text-lg font-medium">
                      {`Question ${index + 1}: ${question}`}
                    </p>
                    <div className="item-center p-5">
                      <p className="mb-2 font-medium text-gray-800">Student Answer:</p>
                      <div className="text-black">{renderAnswer(answers[index])}</div>
                    </div>
                  </div>
                </Card>

                <Card className="w-[40%] rounded-xl border-gray-300" bodyStyle={{ padding: 0 }}>
                  <div>
                    <p className="m-0 rounded-t-xl bg-gray-300 p-3 text-lg font-medium">Comment</p>
                    <div className="p-3">
                      <textarea
                        className="h-20 w-full resize-none rounded border border-gray-300 p-2 outline-none focus:border-blue-500"
                        placeholder="Enter your comment here..."
                        value={feedbacks[activePart]?.[index] || ''}
                        onChange={e => handleFeedbackChange(activePart, index, e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
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
