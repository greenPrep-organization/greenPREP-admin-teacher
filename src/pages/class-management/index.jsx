import { useMemo, useState } from 'react'
import { Table, Input, Button, Card, Typography, Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import CreateClassModal from '@features/class-management/ui/create-new-class'
import { fetchClasses, fetchClassById } from '@features/class-management/api/classes'

const { Title } = Typography

const ClassList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

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

  const handleCreateClass = () => {
    setIsModalVisible(true)
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
      align: 'center'
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
        <Button type="primary" onClick={handleCreateClass} style={{ backgroundColor: '#013088', border: 'none' }}>
          Create Class
        </Button>
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

      <CreateClassModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        existingClasses={filteredClasses}
      />
    </div>
  )
}

export default ClassList
