import { useState, useEffect } from 'react'
import { Button, Card, Input, Spin, Alert } from 'antd'
import PropTypes from 'prop-types'
import { useGetWritingData } from '@features/grading/api'
import { sharedState } from '@features/grading/constants/shared-state'

const { TextArea } = Input

function WritingGrade({ sessionParticipantId }) {
  const [activePart, setActivePart] = useState('part1')
  const [feedbacks, setFeedbacks] = useState({})

  const { data: apiData, isLoading, isError } = useGetWritingData(sessionParticipantId)

  useEffect(() => {
    if (sessionParticipantId) {
      const draft = sharedState.getDraft(sessionParticipantId)
      if (draft.writing) {
        setFeedbacks(draft.writing)
      }
    }
  }, [sessionParticipantId])

  const handlePartChange = key => setActivePart(key)

  const handleFeedbackChange = (part, questionIndex, value) => {
    const updatedFeedbacks = {
      ...feedbacks,
      [part]: { ...feedbacks[part], [questionIndex]: value }
    }
    setFeedbacks(updatedFeedbacks)

    if (sessionParticipantId) {
      sharedState.updateFeedback(sessionParticipantId, 'writing', part, questionIndex, value)
    }
  }

  const processApiData = () => {
    const emptyParts = {
      part1: { questions: [], answers: [], instructions: '', subInstructions: '' },
      part2: { questions: [], answers: [], instructions: '', subInstructions: '' },
      part3: { questions: [], answers: [], instructions: '', subInstructions: '' },
      part4: { questions: [], answers: [], instructions: '', subInstructions: '' }
    }

    if (!apiData?.data?.topic?.Parts) {
      return emptyParts
    }

    const parts = { ...emptyParts }
    const topicParts = apiData.data.topic.Parts

    topicParts.forEach(part => {
      const partContent = part.Content || ''
      let partNumber = 1

      const partMatch = partContent.match(/Part (\d+)/i)
      if (partMatch && partMatch[1]) {
        partNumber = parseInt(partMatch[1])
      }

      const partKey = `part${partNumber}`

      parts[partKey].instructions = part.Content || ''
      parts[partKey].subInstructions = part.SubContent || ''

      if (part.Questions && part.Questions.length > 0) {
        part.Questions.forEach(question => {
          parts[partKey].questions.push(question.Content || '')

          const answer = question.studentAnswer?.AnswerText || ''
          parts[partKey].answers.push(answer)
        })
      }
    })

    return parts
  }

  const processedData = processApiData()
  const currentPart = processedData[activePart] || { questions: [], answers: [], instructions: '', subInstructions: '' }
  const questions = currentPart.questions || []
  const answers = currentPart.answers || []
  const instructions = currentPart.instructions || ''
  const subInstructions = currentPart.subInstructions || ''

  const renderAnswer = answer => {
    if (!answer || answer.trim() === '') {
      return <p className="m-0 italic text-gray-500">No answer submitted</p>
    }
    return <p className="m-0 whitespace-pre-wrap">{answer}</p>
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" tip="Loading writing data..." />
        </div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center">
          <Alert
            message="Error"
            description="Failed to load writing data. Please try again later."
            type="error"
            showIcon
          />
        </div>
      ) : (
        <>
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
            <div>
              <h3 className="mb-2 text-lg font-medium text-[#003087]">{`PART ${activePart.slice(-1)}`}</h3>
              <div className="rounded-lg border border-solid border-[#003087] p-4">
                <p className="m-0 whitespace-pre-wrap text-base">
                  {instructions.match(/^Part \d+:/) ? (
                    <>
                      <span className="font-bold">{instructions.match(/^Part \d+:/)[0]}</span>
                      {instructions.replace(/^Part \d+:/, '')}
                    </>
                  ) : (
                    instructions
                  )}
                </p>
                {subInstructions && (
                  <p className="mt-2 whitespace-pre-wrap text-base italic text-gray-600">
                    {subInstructions.match(/^Part \d+:/) ? (
                      <>
                        <span className="font-bold not-italic">{subInstructions.match(/^Part \d+:/)[0]}</span>
                        <span className="italic">{subInstructions.replace(/^Part \d+:/, '')}</span>
                      </>
                    ) : (
                      subInstructions
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {questions.length === 0 ? (
                <Card className="rounded-lg border-gray-300 shadow-md">
                  <p className="m-0 italic text-gray-500">No questions available</p>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr] gap-6">
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
        </>
      )}
    </div>
  )
}

WritingGrade.propTypes = {
  sessionParticipantId: PropTypes.string.isRequired
}

export default WritingGrade
