import { useState, useEffect, useCallback } from 'react'
import { Card, Input, Spin, Timeline, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { sharedFeedbacks } from '../constants/shared-state'

const { TextArea } = Input

const FEEDBACK_STORAGE_KEY = 'grading_feedbacks'

try {
  const savedFeedbacks = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY))
  if (savedFeedbacks) {
    sharedFeedbacks.writing = savedFeedbacks.writing || {}
    sharedFeedbacks.speaking = savedFeedbacks.speaking || {}
  }
} catch (error) {
  console.error('Error loading feedbacks from localStorage:', error)
}

function Feedback({
  initialFeedback = '',
  onFeedbackChange,
  isLoading = false,
  savedFeedback = null,
  submissionStatus = 'pending',
  feedbackHistory = [],
  activePart,
  type = 'writing'
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
      sharedFeedbacks[type][activePart] = savedFeedback
    }

    if (!savedFeedback && !initialFeedback) {
      setFeedbackByPart(prev => ({
        ...prev,
        [getPartKey(activePart)]: sharedFeedbacks[type][activePart] || ''
      }))
    } else if (initialFeedback) {
      const partKey = getPartKey(activePart)
      setFeedbackByPart(prev => {
        if (!prev[partKey]) {
          sharedFeedbacks[type][activePart] = initialFeedback
          return {
            ...prev,
            [partKey]: initialFeedback
          }
        }
        return prev
      })
    }
  }, [initialFeedback, savedFeedback, activePart, type, getPartKey])

  const handleFeedbackChange = e => {
    const newFeedback = e.target.value
    const partKey = getPartKey(activePart)

    setFeedbackByPart(prev => ({
      ...prev,
      [partKey]: newFeedback
    }))

    sharedFeedbacks[type][activePart] = newFeedback

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

  const currentFeedback = feedbackByPart[getPartKey(activePart)] || sharedFeedbacks[type][activePart] || ''

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
  type: PropTypes.oneOf(['writing', 'speaking'])
}

export default Feedback
