import { Button, Spin } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from '@features/grading/ui/audio-player'
import { Input } from 'antd'

const Speaking = ({ testData, isLoading }) => {
  const [activePart, setActivePart] = useState('PART 1')
  const [scores, setScores] = useState({})
  const parts = useMemo(() => testData?.Parts || [], [testData])

  useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.Content === activePart)) {
      setActivePart(parts[0].Content)
    }
  }, [parts, activePart])

  const handleScoreChange = (questionId, value) => {
    setScores(prev => ({
      ...prev,
      [questionId]: value
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
      {/* Part Selection */}
      <div className="mb-6 flex w-fit gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        {parts.map(part => (
          <Button
            key={part.ID}
            type={activePart === part.Content ? 'primary' : 'default'}
            onClick={() => setActivePart(part.Content)}
            className={`min-w-[80px] rounded-xl border-none ${
              activePart === part.Content ? 'bg-[#003087] text-white' : 'bg-white text-black'
            }`}
          >
            {part.Content}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Left Column - Questions and Audio */}
        <div className="flex-1 space-y-5">
          {/* Part Title */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#003087]">{currentPart.Content}:</h3>
            {currentPart.Questions?.map(question => (
              <div key={`title-${question.ID}`} className="mt-1 text-base">
                {question.Content}
              </div>
            ))}
          </div>

          {currentPart.Questions?.map((question, index) => (
            <div key={question.ID} className="rounded-lg bg-white">
              <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-[#003087]">
                  Question {index + 1}: {question.Content}
                </p>
                {question.ImageKeys?.[0] && (
                  <div className="mt-4">
                    <img
                      src={question.ImageKeys[0]}
                      alt={`Question ${index + 1}`}
                      className="max-h-[200px] rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              <AudioPlayer audioUrl={'https://ipaine.com/dowload/sample.mp3'} />
            </div>
          ))}
        </div>

        {/* Right Column - Scoring */}
        <div className="w-72">
          <div className="sticky top-6 space-y-4 rounded-md border border-gray-800 p-6 shadow-2xl">
            {/* Score Inputs */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="mb-4 font-bold text-[#003087]">{currentPart.Content} Scoring</h4>
              <div className="space-y-4">
                {currentPart.Questions?.map((question, index) => (
                  <div key={`score-${question.ID}`} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#003087]">Question {index + 1}:</span>
                    <Input
                      type="number"
                      className="h-9 w-24 rounded-lg bg-white text-center focus:border-[#003087]"
                      placeholder="Score"
                      min={0}
                      max={10}
                      value={scores[`${currentPart.Content}-${question.ID}`] || ''}
                      onChange={e => handleScoreChange(`${currentPart.Content}-${question.ID}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-3">
              <Button type="primary" className="h-10 w-full rounded-lg bg-[#003087] text-white hover:bg-[#002366]">
                Submit
              </Button>
              <Button
                type="default"
                className="h-10 w-full rounded-lg border border-[#003087] bg-white text-[#003087] hover:bg-[#f0f2ff]"
              >
                Save As Draft
              </Button>
            </div>
          </div>
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
