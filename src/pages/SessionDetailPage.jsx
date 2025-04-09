import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/session/ui/session-participant-list'
import AppBreadcrumb from '@/shared/ui/Breadcrumb'
import { LeftOutlined } from '@ant-design/icons'
import { Button, Skeleton, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'

const { Title } = Typography

const fetchSessionDetail = async sessionId => {
  const res = await axiosInstance.get(`/sessions/${sessionId}`)
  return res.data.data
}

const SessionDetailPage = () => {
  const navigate = useNavigate()
  const { id, sessionId } = useParams()

  const { data: sessionDetail, isLoading } = useQuery({
    queryKey: ['session-detail', sessionId],
    queryFn: () => fetchSessionDetail(sessionId),
    enabled: !!sessionId
  })

  const className = sessionDetail?.Classes?.className ?? 'Loading...'
  const sessionName = sessionDetail?.sessionName ?? 'Loading...'

  const breadcrumbItems = [
    { label: 'Classes', path: '/classes-management' },
    {
      label: isLoading ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : className,
      path: `/classes-management/${id}`,
      state: {
        classInfo: sessionDetail?.Classes
      }
    },
    {
      label: isLoading ? <Skeleton.Input active size="small" style={{ width: 120 }} /> : sessionName
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <AppBreadcrumb items={breadcrumbItems} />

      <div className="mb-4 flex items-center">
        <Button
          onClick={() => navigate(-1)}
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
