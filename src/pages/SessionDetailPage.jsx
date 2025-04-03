import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import { Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SessionDetailPage = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4 flex items-center">
        <Button
          onClick={() => navigate('/classes-management')}
          type="primary"
          style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
        >
          <LeftOutlined /> Back
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
