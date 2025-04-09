// import SessionDetail from '@/features/session/ui/session-detail'
// import SessionParticipantList from '@features/session/ui/session-participant-list'
// import { Button, Typography } from 'antd'
// import { LeftOutlined } from '@ant-design/icons'
// import { useNavigate } from 'react-router-dom'

// const { Title } = Typography

// const SessionDetailPage = () => {
//   const navigate = useNavigate()
//   return (
//     <div className="space-y-2">
//       <div className="flex items-center">
//         <Button
//           onClick={() => navigate(`/classes-management`)}
//           type="primary"
//           style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
//         >
//           <LeftOutlined /> Back
//         </Button>
//       </div>
//       <Title
//         level={3}
//         style={{
//           textAlign: 'left',
//           marginBottom: '24px'
//         }}
//       >
//         Session details
//       </Title>
//       <div className="rounded-lg shadow-sm">
//         <SessionDetail />
//       </div>
//       <div className="rounded-lg shadow-sm">
//         <SessionParticipantList />
//       </div>
//     </div>
//   )
// }

// export default SessionDetailPage
import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import { Breadcrumb, Button, Typography } from 'antd'
import { HomeOutlined, LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const SessionDetailPage = () => {
  const navigate = useNavigate()

  const classId = localStorage.getItem('currentClassId')
  const className = localStorage.getItem('currentClassName')

  const handleBack = () => {
    if (classId) {
      navigate(`/classes-management/${classId}`)
    } else {
      navigate('/classes-management')
    }
  }

  return (
    <div className="space-y-2">
      <Breadcrumb className="mb-4" style={{ cursor: 'pointer' }}>
        <Breadcrumb.Item onClick={() => navigate('/dashboard')}>
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>

        <Breadcrumb.Item onClick={() => navigate('/classes-management')}>Classes</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate(`/classes-management/${classId}`)}>
          {className || 'Class'}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Session Detail</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex items-center">
        <Button
          onClick={handleBack}
          type="primary"
          style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
        >
          <LeftOutlined /> Back
        </Button>
      </div>

      <Title level={3} style={{ textAlign: 'left', marginBottom: '24px' }}>
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
