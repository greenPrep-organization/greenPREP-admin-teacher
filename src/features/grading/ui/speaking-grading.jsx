import { Button, Spin, Input } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from '@features/grading/ui/audio-player'

const { TextArea } = Input

const Speaking = ({ testData, isLoading }) => {
  const [activePart, setActivePart] = useState('PART 1')
  const [questionFeedbacks, setQuestionFeedbacks] = useState({})
  const parts = useMemo(() => testData?.Parts || [], [testData])

  useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.Content === activePart)) {
      setActivePart(parts[0].Content)
    }
  }, [parts, activePart])

  const handleQuestionFeedbackChange = (questionId, feedback) => {
    setQuestionFeedbacks(prev => ({
      ...prev,
      [questionId]: feedback
    }))
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
    <div>
      {/* Part selection tabs */}
      <div className="mb-6 flex gap-1">
        {parts.map(part => (
          <Button
            key={part.ID}
            onClick={() => setActivePart(part.Content)}
            className={`min-w-[80px] rounded-lg border-none px-4 py-1 ${
              activePart === part.Content ? 'bg-[#003087] text-white' : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            {part.Content}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Part title and instructions */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-[#003087]">{currentPart.Content}</h3>
          <div className="rounded-lg border border-solid border-[#003087] p-4">
            {currentPart.Questions?.map(question => (
              <div key={`title-${question.ID}`} className="text-base">
                {question.Content}
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentPart.Questions?.map((question, index) => (
            <div key={question.ID} className="grid grid-cols-[1fr,1fr] gap-6">
              {/* Left container - Question and Student Answer */}
              <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
                <div className="bg-[#E5E7EB] px-4 py-3">
                  <p className="text-base">
                    Question {index + 1}: {question.Content}
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="mb-2 text-base">Student Answer:</p>
                    <AudioPlayer audioUrl={'https://ipaine.com/download/sample.mp3'} />
                  </div>
                </div>
              </div>

              {/* Right container - Comment */}
              <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
                <div className="bg-[#E5E7EB] px-4 py-3">
                  <p className="text-base">Comment</p>
                </div>
                <div className="p-4">
                  <TextArea
                    value={questionFeedbacks[question.ID] || ''}
                    onChange={e => handleQuestionFeedbackChange(question.ID, e.target.value)}
                    placeholder="Enter your feedback here..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className="w-full rounded-lg border-gray-300 focus:border-[#003087] focus:shadow-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
            ImageKeys: PropTypes.arrayOf(PropTypes.string)
          })
        )
      })
    )
  }),
  isLoading: PropTypes.bool
}

export default Speaking
