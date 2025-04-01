import { useLocation, useParams } from 'react-router-dom'
import { Card, Col, Row, Typography, Spin, Alert } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchClassById } from '@features/class-management/api/classes'
import SessionsList from '@features/session/SessionsList'

const { Title } = Typography

const ClassDetailsPage = () => {
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
    staleTime: 60 * 1000
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
      <Title level={1} style={{ textAlign: 'left', marginBottom: '16px' }}>
        Class Details
      </Title>

      <Card className="shadow-md" style={{ marginTop: '16px' }}>
        <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', fontSize: '18px', fontWeight: '500' }}>
          Class Information
        </div>

        <Row style={{ marginTop: '16px' }} justify="space-between">
          <Col>
            <div style={{ fontSize: '16px' }}>
              <span style={{ fontWeight: '600' }}>Class Name:</span> {classDetails?.className ?? 'N/A'}
            </div>
          </Col>
        </Row>
      </Card>
      <SessionsList classId={id} />
    </div>
  )
}

export default ClassDetailsPage
