import { Button, Spin } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from '@features/grading/ui/audio-player'
import Feedback from '@features/grading/ui/feedback-grading'
import GradingScoringPanel from '@features/grading/ui/grading-scoring-panel'

const SPEAKING_STORAGE_KEY = 'speaking_grading_draft'

let hasLoadedSpeakingDraft = false

const Speaking = ({ testData, isLoading }) => {
  const [activePart, setActivePart] = useState('PART 1')
  const [scores, setScores] = useState({})
  const parts = useMemo(() => testData?.Parts || [], [testData])

  useEffect(() => {
    if (!hasLoadedSpeakingDraft && testData) {
      try {
        const draftData = JSON.parse(localStorage.getItem(SPEAKING_STORAGE_KEY))
        if (draftData && Array.isArray(draftData)) {
          const loadedScores = {}

          draftData.forEach(({ part, scores: partScores }) => {
            const partName = `PART ${part.slice(-1)}`

            partScores.forEach(({ questionIndex, score }) => {
              if (score !== null && score !== undefined) {
                const currentPart = parts.find(p => p.Content === partName)
                if (currentPart && currentPart.Questions && currentPart.Questions[questionIndex]) {
                  const questionId = currentPart.Questions[questionIndex].ID
                  loadedScores[`${partName}-${questionId}`] = score
                }
              }
            })
          })

          setScores(loadedScores)
          hasLoadedSpeakingDraft = true
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [testData, parts])

  useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.Content === activePart)) {
      setActivePart(parts[0].Content)
    }
  }, [parts, activePart])

  const handleSubmit = () => {
    // Handle submission logic here
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

      <div className="flex gap-8">
        <div className="flex-1 space-y-5">
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
              <AudioPlayer audioUrl={'https://ipaine.com/download/sample.mp3'} />
            </div>
          ))}
        </div>

        <GradingScoringPanel
          activePart={activePart}
          questions={currentPart.Questions || []}
          scores={scores}
          setScores={setScores}
          type="speaking"
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-6">
        <Feedback activePart={activePart} type="speaking" />
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
