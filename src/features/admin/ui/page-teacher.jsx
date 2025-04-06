import { useTeachers, useUpdateTeacherProfile } from '@features/admin/api'
import { CreateTeacher } from '@features/admin/ui/create-teacher'
import EditTeacherModal from '@features/admin/ui/edit-teacher'
import { Avatar, Button, Card, message, Select, Spin, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminTeachers = () => {
  // @ts-ignore
  const auth = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { data: teachersData, isLoading, isError, refetch } = useTeachers()
  const teachers = teachersData?.data?.teachers || []
  const updateProfileMutation = useUpdateTeacherProfile()

  useEffect(() => {
    if (!auth.role.includes('admin')) {
      navigate('/')
    }
  }, [auth, navigate])

  const handleEdit = teacher => {
    setSelectedTeacher(teacher)
    setIsEditModalOpen(true)
  }

  const handleCancelEdit = () => {
    setSelectedTeacher(null)
    setIsEditModalOpen(false)
  }

  const handleSave = () => {
    refetch()
    setIsEditModalOpen(false)
  }

  const handleAddTeacher = () => {
    setIsAddModalOpen(true)
  }

  const handleCancelAdd = () => {
    setIsAddModalOpen(false)
  }

  const handleRoleChange = async (teacherId, newRoles) => {
    try {
      const rolesToUpdate = newRoles.length === 0 ? [] : newRoles

      await updateProfileMutation.mutateAsync({
        userId: teacherId,
        userData: { roleIDs: rolesToUpdate }
      })

      message.success('Role updated successfully!')
      refetch()
    } catch (error) {
      message.error('Failed to update role')
      console.error('Error updating role:', error)
    }
  }

  const handleStatusToggle = async (teacherId, isActive) => {
    try {
      await updateProfileMutation.mutateAsync({
        userId: teacherId,
        userData: { status: isActive }
      })
      message.success(`Account ${isActive ? 'activated' : 'deactivated'} successfully!`)
      refetch()
    } catch {
      message.error('Failed to update account status')
    }
  }

  const columns = [
    {
      title: 'Teacher',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar className="mr-3 bg-blue-500">
            {record.firstName?.charAt(0)}
            {record.lastName?.charAt(0)}
          </Avatar>
          <div>
            <div className="items-start font-medium">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Teacher Code',
      dataIndex: 'teacherCode',
      key: 'teacherCode',
      width: '10%',
      align: 'center',
      // eslint-disable-next-line no-unused-vars
      render: (teacherCode, record) => (
        <div className="flex items-center">
          <div className="font-medium">{teacherCode}</div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '25%',
      align: 'center',
      render: (role, record) => (
        <Select
          className="w-full"
          mode="multiple"
          value={record.roleIDs || []}
          onChange={newRoles => handleRoleChange(record.ID, newRoles)}
          options={[{ label: 'admin', value: 'admin' }]}
          placeholder="Select roles"
        />
      )
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      render: status => <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'Inactive'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record.ID)}>
            Edit
          </Button>
          <Button type="link" danger={record.status} onClick={() => handleStatusToggle(record.ID, !record.status)}>
            {record.status ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    }
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Manage Teachers</h1>
        <div className="text-red-500">
          Error loading teachers. Please try again later.
          <Button onClick={() => refetch()} className="ml-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Manage Teachers</h1>

      {/* Add Teacher Button */}
      <Button type="primary" className="mb-4" onClick={handleAddTeacher}>
        Add Teacher
      </Button>

      <Card className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <Table
          // @ts-ignore
          columns={columns}
          dataSource={teachers}
          rowKey="ID"
          pagination={{
            pageSize: 10
          }}
        />
      </Card>

      <EditTeacherModal
        isVisible={isEditModalOpen}
        teacherId={selectedTeacher}
        onCancel={handleCancelEdit}
        onSave={handleSave}
      />

      <CreateTeacher open={isAddModalOpen} onClose={handleCancelAdd} onSave={handleSave} />
    </div>
  )
}

export default AdminTeachers
