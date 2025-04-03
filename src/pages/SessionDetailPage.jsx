import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SessionDetailPage = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4 flex items-center">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} className="flex items-center">
          Back
        </Button>
      </div>
      <div className="rounded-lg bg-white">
        <SessionDetail />
      </div>
      <div className="rounded-lg bg-white">
        <SessionParticipantList />
      </div>
    </div>
  )
}

export default SessionDetailPage
