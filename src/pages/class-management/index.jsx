import { useState, useMemo, useEffect } from 'react'
import { Table, Input, Space, Button, Card, Typography, Spin } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useFetchClasses, useFetchClassDetails } from '@features/class-management/hooks/fetch-class'
import { CreateClassModal, EditClassModal } from '@features/class-management/ui/class-modal'
import DeleteClassModal from '@features/class-management/ui/delete-modal'
import AppBreadcrumb from '@shared/ui/Breadcrumb'

const { Title, Text } = Typography

const ClassList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [classToDelete, setClassToDelete] = useState(null)

  const { data: response = {}, isFetching, isLoading, isError, refetch } = useFetchClasses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const classes = response?.data || []
  const { data: classDetails } = useFetchClassDetails(classes)

  const enrichedClasses = useMemo(() => {
    if (!classDetails) return []
    return (
      classes
        .map((cls, index) => ({
          ...cls,
          sessions: classDetails[index]?.totalSessions || 0
        }))
        // @ts-ignore
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    )
  }, [classes, classDetails])

  const filteredClasses = useMemo(() => {
    return enrichedClasses.filter(cls => cls.className?.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, enrichedClasses])

  const [cachedData, setCachedData] = useState([])
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    if (!isFetching && !isLoading) {
      const timer = setTimeout(() => {
        setCachedData(filteredClasses)
        setIsDataReady(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isFetching, isLoading, filteredClasses])

  const displayData = isFetching ? cachedData : filteredClasses

  if (!isDataReady) {
    return <Spin className="flex h-screen items-center justify-center" />
  }

  if (isError) {
    return (
      <Text className="text-center text-red-500">Cannot fetch data from server. Please wait and refresh page!</Text>
    )
  }

  const handleCreateClass = () => setIsModalVisible(true)
  const handleEdit = cls => {
    setEditingClass(cls)
    setIsEditModalVisible(true)
  }
  const handleView = cls => {
    navigate(`/classes-management/${cls.ID}`, { state: { classInfo: cls } })
  }
  const showDeleteModal = clsID => {
    setClassToDelete(clsID)
    setIsDeleteModalVisible(true)
  }

  const columns = [
    {
      title: 'CLASS NAME',
      dataIndex: 'className',
      key: 'className',
      align: 'center',
      render: (text, record) => (
        <a
          onClick={() => handleView(record)}
          style={{ cursor: 'pointer', color: 'black', display: 'inline-block', textAlign: 'left' }}
        >
          {text}
        </a>
      )
    },
    { title: 'NUMBER OF SESSIONS', dataIndex: 'sessions', key: 'sessions', align: 'center' },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size={20}>
          <EditOutlined className="cursor-pointer text-lg text-green-500" onClick={() => handleEdit(record)} />
          <EyeOutlined className="cursor-pointer text-lg text-blue-500" onClick={() => handleView(record)} />
          <DeleteOutlined className="cursor-pointer text-lg text-red-500" onClick={() => showDeleteModal(record.ID)} />
        </Space>
      )
    }
  ]

  return (
    <div>
      <AppBreadcrumb items={[{ label: 'Classes' }]} />
      <Title level={3} style={{ textAlign: 'left', marginBottom: '16px' }}>
        Classes
      </Title>

      <div className="mb-4 flex justify-between">
        <Input.Search
          placeholder="Search class name"
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '50%' }}
        />
        <Button type="primary" onClick={handleCreateClass} style={{ backgroundColor: '#013088', border: 'none' }}>
          Create Class
        </Button>
      </div>

      <Card className="rounded-lg shadow-sm">
        <Table
          // @ts-ignore
          columns={columns}
          dataSource={displayData.map(cls => ({ ...cls, key: cls.ID }))}
          pagination={{ pageSize: 5 }}
          loading={isFetching}
        />
      </Card>

      <CreateClassModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSuccess={() => refetch()} />

      {editingClass && (
        <EditClassModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSuccess={() => refetch()}
          initialData={editingClass}
        />
      )}

      <DeleteClassModal
        visible={isDeleteModalVisible}
        classId={classToDelete}
        onClose={() => setIsDeleteModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}

export default ClassList
