import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Typography, Spin, Alert, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchClassDetails } from '@features/class-management/api'
import SessionsList from '@features/session/ui/session-list'
import { LeftOutlined } from '@ant-design/icons'
import AppBreadcrumb from '@shared/ui/Breadcrumb'

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
      const res = await fetchClassDetails(id)
      return res?.data || res
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })

  const classDetails = classInfoFromState || classInfo
  const className = classDetails?.className || 'N/A'

  if (isLoading) {
    return <Spin size="large" className="flex h-screen items-center justify-center" />
  }

  if (isError || !classDetails) {
    return <Alert message="Failed to load class details" type="error" showIcon className="text-center" />
  }

  return (
    <div>
      <AppBreadcrumb items={[{ label: 'Classes', path: '/classes-management' }, { label: className }]} />

      <Button
        onClick={() => navigate('/classes-management')}
        type="primary"
        style={{ backgroundColor: '#013088', border: 'none', marginBottom: '16px' }}
      >
        <LeftOutlined /> Back
      </Button>

      <Title level={3} style={{ textAlign: 'left', marginBottom: '24px' }}>
        Class details
      </Title>

      <Card className="mb-2 mt-4 shadow-sm">
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
          Class Information
        </Title>

        <Row style={{ marginTop: '16px' }} justify="space-between">
          <Col>
            <div style={{ fontSize: '14px' }}>
              Class Name: <span style={{ fontWeight: '500', marginLeft: '50px' }}>{className}</span>
            </div>
          </Col>
        </Row>
      </Card>

      <SessionsList classId={id} />
    </div>
  )
}

export default ClassDetails
