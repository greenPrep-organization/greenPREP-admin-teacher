import { useState, useMemo } from 'react'
import { Table, Input, Space, Button, Card, message, Typography, Breadcrumb, Spin } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchClasses, deleteClass, fetchClassDetails } from '@features/class-management/api'
import { CreateClassModal, EditClassModal } from '@features/class-management/ui/class-modal'
import DeleteConfirmModal from '@features/class-management/ui/delete-class'

const { Title, Text } = Typography

const ClassList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [classToDelete, setClassToDelete] = useState(null)

  const {
    data: response = {},
    isLoading,
    isError
  } = useQuery({
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
      const data = await Promise.all(classes.map(cls => fetchClassDetails(cls.ID)))
      return data
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: classes.length > 0
  })

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

  const deleteClassMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['classes'])
      message.success('Class deleted successfully!')
      setDeleteModalVisible(false)
    },
    onError: () => {
      message.error('Failed to delete class')
    }
  })

  const handleCreateClass = () => {
    setIsModalVisible(true)
  }

  const handleEdit = cls => {
    setEditingClass(cls)
    setIsEditModalVisible(true)
  }

  const handleView = cls => {
    navigate(`/classes-management/${cls.ID}`, {
      state: { classInfo: cls }
    })
  }

  const showDeleteModal = clsID => {
    setClassToDelete(clsID)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteClassMutation.mutate(classToDelete)
    }
  }

  if (isLoading) {
    return <Spin className="flex h-screen items-center justify-center" />
  }

  if (isError) {
    return (
      <Text className="text-center text-red-500">Cannot fetch data from server. Please wait and refresh page!</Text>
    )
  }

  const columns = [
    {
      title: 'CLASS NAME',
      dataIndex: 'className',
      key: 'className',
      align: 'center',
      render: (text, record) => (
        <a onClick={() => handleView(record)} style={{ cursor: 'pointer', color: 'black' }}>
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
      <Breadcrumb className="mb-4" style={{ cursor: 'pointer' }}>
        <Breadcrumb.Item onClick={() => navigate('/dashboard')}>
          <HomeOutlined /> <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Classes</Breadcrumb.Item>
      </Breadcrumb>
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

      <Card className="rounded-lg shadow-md">
        <Table
          // @ts-ignore
          columns={columns}
          dataSource={filteredClasses.map(cls => ({ ...cls, key: cls.ID }))}
          pagination={{ pageSize: 5 }}
          loading={isLoading}
        />
      </Card>

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
      <CreateClassModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        // @ts-ignore
        onSuccess={() => queryClient.invalidateQueries(['classes'])}
      />
      {editingClass && (
        <EditClassModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          // @ts-ignore
          onSuccess={() => queryClient.invalidateQueries(['classes'])}
          initialData={editingClass}
        />
      )}
    </div>
  )
}

export default ClassList
