import { useState, useEffect, useCallback } from 'react'
import { Card, Input, Spin, Timeline, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { sharedState } from '@features/grading/constants/shared-state'

const { TextArea } = Input

function Feedback({
  initialFeedback = '',
  onFeedbackChange,
  isLoading = false,
  savedFeedback = null,
  submissionStatus = 'pending',
  feedbackHistory = [],
  activePart,
  type = 'writing',
  sessionParticipantId
}) {
  const [feedbackByPart, setFeedbackByPart] = useState({})
  const [showHistory, setShowHistory] = useState(false)

  const getPartKey = useCallback(
    part => {
      return `${type}_${part}`
    },
    [type]
  )

  useEffect(() => {
    if (savedFeedback) {
      if (sessionParticipantId) {
        sharedState.updateFeedback(sessionParticipantId, type, activePart, 0, savedFeedback)
      }
    }

    if (!savedFeedback && !initialFeedback) {
      if (sessionParticipantId) {
        const draft = sharedState.getDraft(sessionParticipantId)
        const feedback = draft[type]?.[activePart]?.[0] || ''

        setFeedbackByPart(prev => ({
          ...prev,
          [getPartKey(activePart)]: feedback
        }))
      }
    } else if (initialFeedback) {
      const partKey = getPartKey(activePart)
      setFeedbackByPart(prev => {
        if (!prev[partKey]) {
          if (sessionParticipantId) {
            sharedState.updateFeedback(sessionParticipantId, type, activePart, 0, initialFeedback)
          }
          return {
            ...prev,
            [partKey]: initialFeedback
          }
        }
        return prev
      })
    }
  }, [initialFeedback, savedFeedback, activePart, type, getPartKey, sessionParticipantId])

  const handleFeedbackChange = e => {
    const newFeedback = e.target.value
    const partKey = getPartKey(activePart)

    setFeedbackByPart(prev => ({
      ...prev,
      [partKey]: newFeedback
    }))

    if (sessionParticipantId) {
      sharedState.updateFeedback(sessionParticipantId, type, activePart, 0, newFeedback)
    }

    if (onFeedbackChange) {
      onFeedbackChange(newFeedback, activePart, type)
    }
  }

  const renderFeedbackHistory = () => {
    const filteredHistory = feedbackHistory.filter(entry => entry.part === activePart && entry.type === type)

    if (!filteredHistory || filteredHistory.length === 0) {
      return <div className="py-4 text-center text-gray-500">No previous feedback history for this part</div>
    }

    return (
      <Timeline className="mt-4">
        {filteredHistory.map((entry, index) => (
          <Timeline.Item
            key={index}
            dot={
              entry.status === 'graded' ? (
                <CheckCircleOutlined className="text-green-500" />
              ) : (
                <ClockCircleOutlined className="text-blue-500" />
              )
            }
          >
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="mb-2 flex items-start justify-between">
                <Tooltip title={new Date(entry.timestamp).toLocaleString()}>
                  <span className="text-sm text-gray-600">{new Date(entry.timestamp).toLocaleDateString()}</span>
                </Tooltip>
                <span className="text-sm font-medium text-gray-700">Grade: {entry.grade}</span>
              </div>
              <div className="whitespace-pre-wrap text-gray-800">{entry.feedback}</div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    )
  }

  let currentFeedback = ''

  if (sessionParticipantId) {
    const draft = sharedState.getDraft(sessionParticipantId)
    currentFeedback = feedbackByPart[getPartKey(activePart)] || draft[type]?.[activePart]?.[0] || ''
  } else {
    currentFeedback = feedbackByPart[getPartKey(activePart)] || ''
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Feedback</span>
          {submissionStatus === 'graded' && <span className="text-sm text-green-600">✓ Saved with grade</span>}
        </div>
      }
      className="rounded-lg shadow-md"
      headStyle={{
        backgroundColor: '#f3f4f6',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}
      extra={
        feedbackHistory &&
        feedbackHistory.length > 0 && (
          <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-blue-600 hover:text-blue-800">
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        )
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <>
            <TextArea
              placeholder={
                submissionStatus === 'graded'
                  ? 'Previous feedback will be shown here'
                  : 'Easy grammar, using more complex sentences and vocab to upgrade band level'
              }
              value={currentFeedback}
              onChange={handleFeedbackChange}
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="w-full rounded-lg border-gray-300 focus:border-[#003087] focus:shadow-none"
            />
            {showHistory && renderFeedbackHistory()}
          </>
        )}
      </div>
    </Card>
  )
}

Feedback.propTypes = {
  initialFeedback: PropTypes.string,
  onFeedbackChange: PropTypes.func,
  isLoading: PropTypes.bool,
  savedFeedback: PropTypes.string,
  submissionStatus: PropTypes.oneOf(['pending', 'graded']),
  feedbackHistory: PropTypes.arrayOf(
    PropTypes.shape({
      feedback: PropTypes.string.isRequired,
      grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      timestamp: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['graded', 'draft']).isRequired,
      part: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['writing', 'speaking']).isRequired
    })
  ),
  activePart: PropTypes.string,
  type: PropTypes.oneOf(['writing', 'speaking']),
  sessionParticipantId: PropTypes.string
}

export default Feedback
