import { Input, Button } from 'antd'
import { useState } from 'react'
import PropTypes from 'prop-types'

const GradingScoringPanel = ({ type = 'writing', onSubmit }) => {
  const [totalScore, setTotalScore] = useState('')

  const handleScoreChange = value => {
    let numericValue = value === '' || value === null || value === undefined ? '' : Number(value)

    if (numericValue !== '' && typeof numericValue === 'number') {
      if (numericValue < 0) {
        numericValue = 0
      } else if (numericValue > 100) {
        numericValue = 100
      }
    }

    setTotalScore(value)
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          {type === 'writing' ? 'Writing Assessment Part' : 'Speaking Assessment Part'}
        </h2>
        <span className="text-sm text-gray-400">
          {type === 'writing'
            ? 'Detailed breakdown in the writing assessment'
            : 'Detailed breakdown in the speaking assessment'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium">Total Score:</span>
          <Input
            type="number"
            className="h-11 w-28 rounded-lg border-gray-200 text-center text-base focus:border-[#003087]"
            placeholder="Score"
            min={0}
            max={100}
            value={totalScore}
            onChange={e => {
              const value = e.target.value === '' ? '' : e.target.value.replace(/[^0-9]/g, '')
              handleScoreChange(value)
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

        <Button
          onClick={() => onSubmit(totalScore)}
          className="h-11 rounded-lg border border-gray-200 px-6 text-base font-medium hover:bg-gray-50"
        >
          Save As Draft
        </Button>

        <Button
          onClick={() => onSubmit(totalScore)}
          className="h-11 rounded-lg bg-[#003087] px-6 text-base font-medium text-white hover:bg-[#002366]"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

GradingScoringPanel.propTypes = {
  type: PropTypes.oneOf(['writing', 'speaking']),
  onSubmit: PropTypes.func.isRequired
}

export default GradingScoringPanel
