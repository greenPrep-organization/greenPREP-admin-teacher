import { useTeachers, useUpdateTeacherProfile } from '@features/admin/api'
import EditTeacherModal from '@features/admin/ui/edit-teacher'
import { Avatar, Button, Card, message, Select, Spin, Table, Tag } from 'antd'
import { useState } from 'react'

const AdminTeachers = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { data: teachersData, isLoading, isError, refetch } = useTeachers()
  const teachers = teachersData?.data?.teachers || []
  const updateProfileMutation = useUpdateTeacherProfile()

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
            <div className="font-medium">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: phone => phone || '-'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
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
      render: status => <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'Inactive'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
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

      <Card className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <Table
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
    </div>
  )
}

export default AdminTeachers
