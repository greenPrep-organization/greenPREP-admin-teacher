import { Button, Spin, Input } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from '@features/grading/ui/audio-player'
import { sharedState } from '@features/grading/constants/shared-state'

const { TextArea } = Input

const Speaking = ({ testData, isLoading, sessionParticipantId }) => {
  const [activePart, setActivePart] = useState('PART 1')
  const [feedbacks, setFeedbacks] = useState({})

  const parts = useMemo(() => {
    const sortedParts = [...(testData?.Parts || [])].sort((a, b) => {
      const partNumberA = parseInt(a.Content.split(' ')[1])
      const partNumberB = parseInt(b.Content.split(' ')[1])
      return partNumberA - partNumberB
    })
    return sortedParts
  }, [testData])

  useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.Content === activePart)) {
      setActivePart(parts[0].Content)
    }
  }, [parts, activePart])

  useEffect(() => {
    if (sessionParticipantId) {
      const draft = sharedState.getDraft(sessionParticipantId)
      if (draft.speaking) {
        setFeedbacks(draft.speaking)
      }
    }
  }, [sessionParticipantId])

  const handleFeedbackChange = (part, questionIndex, value) => {
    const updatedFeedbacks = {
      ...feedbacks,
      [part]: {
        ...feedbacks[part],
        [questionIndex]: value
      }
    }
    setFeedbacks(updatedFeedbacks)

    if (sessionParticipantId) {
      sharedState.updateFeedback(sessionParticipantId, 'speaking', part, questionIndex, value)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!testData) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        No test data available. Please check the topic ID.
      </div>
    )
  }

  const currentPart = parts.find(part => part.Content === activePart) || parts[0]

  if (!currentPart) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">No parts available in this test.</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {parts.map(part => (
          <Button
            key={part.ID}
            onClick={() => setActivePart(part.Content)}
            className={`rounded-lg px-6 py-2 ${
              activePart === part.Content
                ? 'bg-[#003087] text-white hover:bg-[#002366]'
                : 'border border-gray-200 bg-white'
            }`}
          >
            {part.Content}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {currentPart.Questions?.map((question, index) => (
          <div key={question.ID} className="grid grid-cols-[1fr,1fr] gap-6">
            <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
              <div className="bg-[#E5E7EB] px-4 py-3">
                <p className="text-base">
                  Question {index + 1}: {question.Content}
                </p>
              </div>
              <div className="space-y-4 p-4">
                {question.ImageKeys?.[0] && (
                  <div>
                    <img
                      src={question.ImageKeys[0]}
                      alt="Question reference"
                      className="mx-auto h-[250px] w-full max-w-[400px] rounded-lg border border-gray-200 object-contain"
                    />
                  </div>
                )}
                <div>
                  <p className="mb-2 text-base">Student Answer:</p>
                  {question.studentAnswer?.AnswerAudio ? (
                    <AudioPlayer audioUrl={question.studentAnswer.AnswerAudio} />
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4 text-gray-500">No audio submission available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 shadow-md">
              <div className="bg-[#E5E7EB] px-4 py-3">
                <p className="text-base">Comment</p>
              </div>
              <div className="flex-1 p-4">
                <TextArea
                  value={feedbacks[activePart]?.[index] || ''}
                  onChange={e => handleFeedbackChange(activePart, index, e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="h-full !min-h-full w-full resize-none rounded-lg border-gray-300 focus:border-[#003087] focus:shadow-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Speaking.propTypes = {
  testData: PropTypes.shape({
    ID: PropTypes.string,
    Name: PropTypes.string,
    Parts: PropTypes.arrayOf(
      PropTypes.shape({
        ID: PropTypes.string,
        Content: PropTypes.string,
        Questions: PropTypes.arrayOf(
          PropTypes.shape({
            ID: PropTypes.string,
            Content: PropTypes.string,
            ImageKeys: PropTypes.arrayOf(PropTypes.string),
            AudioKeys: PropTypes.arrayOf(PropTypes.string),
            AnswerContent: PropTypes.shape({
              audioUrl: PropTypes.string,
              content: PropTypes.string
            })
          })
        )
      })
    )
  }),
  isLoading: PropTypes.bool,
  sessionParticipantId: PropTypes.string.isRequired
}

export default Speaking
