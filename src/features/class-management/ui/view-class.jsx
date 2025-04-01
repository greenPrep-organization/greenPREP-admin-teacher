import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Typography, Spin, Alert, Breadcrumb, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchClassById } from '@features/class-management/api/classes'
import SessionsList from '@features/session/ui/session-list'
import { HomeOutlined, LeftOutlined } from '@ant-design/icons'

const { Title } = Typography

const ClassDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { classInfo: classInfoFromState } = location.state || {}
  const {
    data: classInfo,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const res = await fetchClassById(id)
      return res?.data || res
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })

  const classDetails = classInfoFromState || classInfo

  if (isLoading) {
    return <Spin size="large" className="flex h-screen items-center justify-center" />
  }

  if (isError || !classDetails) {
    return <Alert message="Failed to load class details" type="error" showIcon className="text-center" />
  }

  return (
    <div>
      <Breadcrumb className="mb-4" style={{ cursor: 'pointer' }}>
        <Breadcrumb.Item onClick={() => navigate('/dashboard')}>
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/classes-management')}>Classes</Breadcrumb.Item>
        <Breadcrumb.Item>{classDetails?.className ?? 'N/A'}</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => navigate('/classes-management')}
        type="primary"
        style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
      >
        <LeftOutlined /> Back
      </Button>
      <Title level={3} style={{ textAlign: 'left', marginBottom: '16px' }}>
        Class Details
      </Title>

      <Card className="shadow-md" style={{ marginTop: '16px' }}>
        <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
          Class Information
        </div>

        <Row style={{ marginTop: '16px' }} justify="space-between">
          <Col>
            <div style={{ fontSize: '16px' }}>
              Class Name:{' '}
              <span style={{ fontWeight: '600', marginLeft: '50px' }}>{classDetails?.className ?? 'N/A'}</span>
            </div>
          </Col>
        </Row>
      </Card>
      <SessionsList classId={id} />
    </div>
  )
}

export default ClassDetails
