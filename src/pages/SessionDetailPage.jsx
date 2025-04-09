import SessionDetail from '@/features/session/ui/session-detail'
import { LeftOutlined } from '@ant-design/icons'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import { Breadcrumb, Button } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

const SessionDetailPage = () => {
  const navigate = useNavigate()
  const { classId, sessionId } = useParams()

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/classes-management">Classes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/classes-management/${classId}`}>{classId}</Link>
          </Breadcrumb.Item>
          {sessionId && (
            <Breadcrumb.Item>
              <Link to={`/classes-management/${classId}/${sessionId}`}>{sessionId}</Link>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>

      <div className="mb-4 flex items-center">
        <Button
          onClick={() => navigate(-1)}
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
