import { useMemo, useState } from 'react'
import { Table, Input, Space, Card, Typography, Breadcrumb } from 'antd'
import { EyeOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClasses, fetchClassById } from '@features/class-management/api/classes'

const { Title } = Typography

const ClassList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: response = {}, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const classes = response?.data || []

  const { data: classDetails } = useQuery({
    queryKey: ['classDetails', classes.map(cls => cls.ID)],
    queryFn: async () => {
      const data = await Promise.all(classes.map(cls => fetchClassById(cls.ID)))
      return data
    },
    enabled: classes.length > 0
  })

  const enrichedClasses = useMemo(() => {
    if (!classDetails) return []
    return classes.map(cls => {
      const classDetail = classDetails.find(detail => detail.ID === cls.ID)
      return {
        ...cls,
        sessions: classDetail?.Sessions?.length || 0
      }
    })
  }, [classes, classDetails])

  const filteredClasses = useMemo(() => {
    return enrichedClasses.filter(cls => cls.className?.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, enrichedClasses])

  const handleView = cls => {
    navigate(`/classes-management/${cls.ID}`, {
      state: { classInfo: cls }
    })
  }

  const columns = [
    { title: 'CLASS NAME', dataIndex: 'className', key: 'className' },
    {
      title: 'NUMBER OF SESSIONS',
      dataIndex: 'sessions',
      key: 'sessions',
      align: 'center'
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size={20}>
          <EyeOutlined className="cursor-pointer text-lg text-blue-500" onClick={() => handleView(record)} />
        </Space>
      )
    }
  ]

  return (
    <div>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Classes</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={1} style={{ textAlign: 'left', marginBottom: '16px' }}>
        Classes
      </Title>

      <div className="mb-4 flex justify-between">
        <Input.Search
          placeholder="Search by class name"
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '50%' }}
        />
      </div>

      <Card className="rounded-lg shadow-md">
        <Table
          // @ts-ignore
          columns={columns}
          dataSource={filteredClasses.map(cls => ({ ...cls, key: cls.ID }))}
          pagination={{ pageSize: 5 }}
          loading={isLoading}
        />
      </Card>
    </div>
  )
}

export default ClassList
