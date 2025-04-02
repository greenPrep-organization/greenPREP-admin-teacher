import { Input, Divider } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import SaveAsDraftButton from './save-as-draft-button'
import { sharedScores } from '@features/grading/constants/shared-state'

const GradingScoringPanel = ({ activePart, questions, scores, setScores, type = 'writing', onSubmit }) => {
  const [totalScore, setTotalScore] = useState(0)

  // Helper function to get the question ID based on type and index
  const getQuestionId = useCallback(
    (question, index) => {
      if (type === 'writing') {
        return `${activePart}_question_${index}`
      } else {
        return `${activePart}-${question.ID}`
      }
    },
    [activePart, type]
  )

  // Initialize scores from shared state when component mounts or type changes
  useEffect(() => {
    // Update the shared scores with any new scores passed in
    if (scores && Object.keys(scores).length > 0) {
      sharedScores[type] = { ...sharedScores[type], ...scores }
    }

    // Use shared scores if no scores are provided
    if (!scores || Object.keys(scores).length === 0) {
      setScores(sharedScores[type])
    }
  }, [type, scores, setScores])

  // Calculate total score for the current part
  useEffect(() => {
    if (questions && questions.length > 0) {
      let total = 0
      questions.forEach((_, index) => {
        const questionId = getQuestionId(questions[index], index)
        const score = scores[questionId] || 0
        total += Number(score)
      })
      setTotalScore(total)
    }
  }, [activePart, scores, questions, getQuestionId])

  const handleScoreChange = (questionId, value) => {
    // Allow empty values, otherwise convert to number and limit to 0-100
    let numericValue = value === '' || value === null || value === undefined ? '' : Number(value)

    // Ensure the value is between 0 and 100 only if it's a number
    if (numericValue !== '' && typeof numericValue === 'number') {
      if (numericValue < 0) {
        numericValue = 0
      } else if (numericValue > 100) {
        numericValue = 100
      }
    }

    // Update both the local state and shared state
    const newScores = {
      ...scores,
      [questionId]: numericValue
    }

    setScores(newScores)
    sharedScores[type] = newScores
  }

  return (
    <div className="w-72">
      <div className="sticky top-6 space-y-4 rounded-md border border-gray-800 p-6 shadow-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h4 className="mb-4 font-bold text-[#003087]">
            {type === 'writing' ? `Part ${activePart.slice(-1)} Scoring` : `${activePart} Scoring`}
          </h4>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const questionId = getQuestionId(question, index)

              return (
                <div key={type === 'writing' ? index : question.ID} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#003087]">Question {index + 1}:</span>
                  <Input
                    type="number"
                    className="h-9 w-24 rounded-lg bg-white text-center focus:border-[#003087]"
                    placeholder="Score"
                    min={0}
                    max={100}
                    value={scores[questionId] || ''}
                    onChange={e => {
                      // Allow numeric input including 0
                      const value = e.target.value === '' ? '' : e.target.value.replace(/[^0-9]/g, '')
                      handleScoreChange(questionId, value)
                    }}
                    onKeyPress={e => {
                      // Allow numeric key presses including 0
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
              )
            })}
          </div>

          <Divider className="my-4 border-black" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#003087]">Total:</span>
            <Input type="number" className="h-9 w-24 rounded-lg bg-gray-50 text-center" value={totalScore} disabled />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={onSubmit}
            className="h-10 w-full rounded-lg bg-[#003087] text-white hover:bg-[#002366]"
          >
            Submit
          </button>
          <SaveAsDraftButton />
        </div>
      </div>
    </div>
  )
}

GradingScoringPanel.propTypes = {
  activePart: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  scores: PropTypes.object.isRequired,
  setScores: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['writing', 'speaking']),
  onSubmit: PropTypes.func.isRequired
}

export default GradingScoringPanel
