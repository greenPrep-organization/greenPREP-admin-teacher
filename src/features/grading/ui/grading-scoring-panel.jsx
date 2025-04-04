import { Input, Divider } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import SaveAsDraftButton from '@features/grading/ui/save-as-draft-button'
import { sharedScores } from '@features/grading/constants/shared-state'
import ExportToPdfButton from "@features/grading/ui/export-to-pdf.jsx";

const GradingScoringPanel = ({ activePart, questions, scores, setScores, type = 'writing', onSubmit, studentId }) => {
  const [totalScore, setTotalScore] = useState(0)

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

  useEffect(() => {
    if (scores && Object.keys(scores).length > 0) {
      sharedScores[type] = { ...sharedScores[type], ...scores }
    }

    if (!scores || Object.keys(scores).length === 0) {
      setScores(sharedScores[type])
    }
  }, [type, scores, setScores])

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
    let numericValue = value === '' || value === null || value === undefined ? '' : Number(value)

    if (numericValue !== '' && typeof numericValue === 'number') {
      if (numericValue < 0) {
        numericValue = 0
      } else if (numericValue > 100) {
        numericValue = 100
      }
    }

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
            {type === 'writing' ? `PART ${activePart.slice(-1)} Scoring` : `${activePart} Scoring`}
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
                    value={scores[questionId] === 0 ? 0 : scores[questionId] || ''}
                    onChange={e => {
                      const value = e.target.value === '' ? '' : e.target.value.replace(/[^0-9]/g, '')
                      handleScoreChange(questionId, value)
                    }}
                    onKeyDown={e => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== 'Backspace' &&
                        e.key !== 'Delete' &&
                        e.key !== 'ArrowLeft' &&
                        e.key !== 'ArrowRight' &&
                        e.key !== 'Tab'
                      ) {
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
          <ExportToPdfButton studentId={studentId} activePart={activePart} />
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
  onSubmit: PropTypes.func.isRequired,
  studentId: PropTypes.string.isRequired,
}

export default GradingScoringPanel
