import { useMemo, useState } from 'react'
import { Table, Input, Space, Button, Card, message, Typography, Breadcrumb } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CreateClassModal from '@features/class-management/ui/create-new-class'
import EditClassModal from '@features/class-management/ui/edit-class'
import DeleteConfirmModal from '@features/class-management/ui/delete-class'
import { fetchClasses, updateClass, deleteClass, fetchClassById } from '@features/class-management/api/classes'

const { Title } = Typography

const ClassList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [classToDelete, setClassToDelete] = useState(null)

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

  const updateClassMutation = useMutation({
    // @ts-ignore
    mutationFn: ({ id, newName }) => updateClass(id, { className: newName }),
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['classes'])
      message.success('Class updated successfully!')
      setIsEditModalVisible(false)
    },
    onError: () => {
      message.error('Failed to update class')
    }
  })

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

  const handleCreateClass = () => {
    setIsModalVisible(true)
  }

  const handleUpdateClass = newName => {
    if (!editingClass?.ID) {
      message.error('Invalid class ID!')
      return
    }
    const isDuplicate = classes.some(
      cls => cls.className.toLowerCase() === newName.toLowerCase() && cls.ID !== editingClass.ID
    )

    if (isDuplicate) {
      message.error('Class name already exists!')
      return
    }
    // @ts-ignore
    updateClassMutation.mutate({ id: editingClass.ID, newName })
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
          <EditOutlined className="cursor-pointer text-lg text-green-500" onClick={() => handleEdit(record)} />
          <EyeOutlined className="cursor-pointer text-lg text-blue-500" onClick={() => handleView(record)} />
          <DeleteOutlined className="cursor-pointer text-lg text-red-500" onClick={() => showDeleteModal(record.ID)} />
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
        existingClasses={filteredClasses}
      />
      {editingClass && (
        <EditClassModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleUpdateClass}
          className={editingClass?.className}
        />
      )}
    </div>
  )
}

export default ClassList
