import { Input, Button, message } from 'antd'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SaveAsDraftButton from './save-as-draft-button'
import { FlagOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'

const GradingScoringPanel = ({
  type,
  onSubmit,
  onSectionChange,
  isSpeakingGraded,
  isWritingGraded,
  isFirstCompletionNotice,
  score,
  onScoreChange,
  previousScore,
  sessionParticipantId
}) => {
  const [error, setError] = useState('')
  const [hasDraft, setHasDraft] = useState(false)

  const checkForDraft = () => {
    if (sessionParticipantId) {
      const draftKey = `draft_${sessionParticipantId}`
      const savedDraft = localStorage.getItem(draftKey)
      setHasDraft(!!savedDraft)
    }
  }

  useEffect(() => {
    checkForDraft()
  }, [sessionParticipantId])

  const handleScoreChange = value => {
    let numericValue = value === '' ? '' : Number(value.replace(/[^0-9]/g, ''))
    if (numericValue !== '') {
      // @ts-ignore
      if (numericValue < 0) numericValue = 0
      // @ts-ignore
      else if (numericValue > 50) numericValue = 50
    }
    onScoreChange(numericValue.toString())
    setError('')
  }

  const handleSubmit = () => {
    if (score === '') {
      setError("Can't be empty.")
      return
    }

    const numericScore = Number(score)
    const hasScoreChanged = score !== previousScore

    if ((type === 'speaking' && isSpeakingGraded) || (type === 'writing' && isWritingGraded)) {
      if (hasScoreChanged) {
        onSubmit(numericScore, type)
        message.success(`${type === 'speaking' ? 'Speaking' : 'Writing'} score updated successfully!`)
      } else {
        message.info('This section has already been graded.')
        if (type === 'speaking' && !isWritingGraded) onSectionChange('writing')
        else if (type === 'writing' && !isSpeakingGraded) onSectionChange('speaking')
      }
      return
    }

    onSubmit(numericScore, type)
    setError('')

    const willBeFullyGraded = (type === 'speaking' && isWritingGraded) || (type === 'writing' && isSpeakingGraded)
    if (willBeFullyGraded && isFirstCompletionNotice) {
      message.success('This student has been graded.')
    } else {
      if (type === 'speaking') {
        message.success('Speaking grading completed!')
        onSectionChange('writing')
      } else if (type === 'writing') {
        message.success('Writing grading completed!')
        onSectionChange('speaking')
      }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={3} style={{ textAlign: 'left', marginBottom: '24px' }}>
          {type === 'writing' ? 'Writing Assessment Part' : 'Speaking Assessment Part'}
        </Title>
        <span className="text-sm text-gray-400">
          {type === 'writing'
            ? 'Detailed breakdown in the writing assessment'
            : 'Detailed breakdown in the speaking assessment'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium">Total Score:</span>
            <Input
              type="number"
              className="h-11 w-28 rounded-lg border-gray-200 text-center text-base focus:border-[#003087]"
              placeholder="Score"
              min={0}
              max={50}
              value={score}
              onChange={e => handleScoreChange(e.target.value)}
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
          {error && <span className="ml-auto text-sm text-red-500">{error}</span>}
          {hasDraft && (
            <div className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-sm text-red-600">
              <FlagOutlined />
              <span>Drafted</span>
            </div>
          )}
        </div>
        <SaveAsDraftButton sessionParticipantId={sessionParticipantId} onDraftSaved={checkForDraft} />
        <Button
          onClick={handleSubmit}
          className="h-11 rounded-lg bg-[#003087] px-6 text-base font-medium text-white hover:bg-[#002366]"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

GradingScoringPanel.propTypes = {
  type: PropTypes.oneOf(['writing', 'speaking']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  isSpeakingGraded: PropTypes.bool.isRequired,
  isWritingGraded: PropTypes.bool.isRequired,
  isFirstCompletionNotice: PropTypes.bool.isRequired,
  score: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  previousScore: PropTypes.string,
  sessionParticipantId: PropTypes.string.isRequired
}

export default GradingScoringPanel
