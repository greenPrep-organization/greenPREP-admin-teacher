import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import { Button, Typography } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const SessionDetailPage = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Button
          onClick={() => navigate('/classes-management')}
          type="primary"
          style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
        >
          <LeftOutlined /> Back
        </Button>
      </div>
      <Title
        level={3}
        style={{
          textAlign: 'left',
          marginBottom: '24px'
        }}
      >
        Session details
      </Title>
      <div className="rounded-lg shadow-sm">
        <SessionDetail />
      </div>
      <div className="rounded-lg shadow-sm">
        <SessionParticipantList />
      </div>
    </div>
  )
}

export default SessionDetailPage
