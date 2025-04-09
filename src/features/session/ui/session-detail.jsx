import { useEffect, useState } from 'react'
import { Tag, Spin, Alert, Typography } from 'antd'
import { formatDateTime, getStatusColor } from '@shared/lib/utils/index'
import { getSessionDetail, getSessionParticipants } from '../api'
import { useParams } from 'react-router-dom'

const { Title } = Typography

const SessionDetail = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionData, setSessionData] = useState(null)
  const [participantCount, setParticipantCount] = useState(0)
  const { sessionId } = useParams()

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getSessionDetail(sessionId)
        setSessionData(data.data)
        const participantsResponse = await getSessionParticipants(sessionId)
        setParticipantCount(participantsResponse.data?.length || 0)
      } catch (error) {
        setError(error.message || 'Unable to load session details. Please try again later')
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg bg-white">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    )
  }

  const statusColors = getStatusColor(sessionData?.status || 'Pending')

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-4 flex items-center justify-between border-b">
        <Title
          level={5}
          style={{
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          Session Information
        </Title>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6 border-b border-r-0 pb-6 md:border-b-0 md:border-r md:pr-6">
          <div>
            <p className="mb-2 text-sm text-gray-500">Session Name</p>
            <p className="font-medium">{sessionData?.sessionName || 'N/A'}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">Session Key</p>
            <p className="font-medium">{sessionData?.sessionKey || 'N/A'}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">Status</p>
            <Tag className={`rounded-full border-0 px-4 py-1 ${statusColors.bg} ${statusColors.text}`}>
              {sessionData?.status || 'Pending'}
            </Tag>
          </div>
        </div>

        <div className="space-y-6 pl-0 md:pl-6">
          <div>
            <p className="mb-2 text-sm text-gray-500">Start Time</p>
            <p className="font-medium">{sessionData?.startTime ? formatDateTime(sessionData.startTime) : 'N/A'}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">End Time</p>
            <p className="font-medium">{sessionData?.endTime ? formatDateTime(sessionData.endTime) : 'N/A'}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">Number of Participants</p>
            <p className="font-medium">{participantCount || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetail
