import { DeleteOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { useTeachers, useUpdateTeacherProfile } from '@features/admin/hooks'
import EditTeacherModal from '@features/admin/ui/edit-teacher'
import { CreateTeacher } from '@features/admin/ui/create-teacher'
import { Button, Input, message, Pagination, Select, Space, Spin, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import StatusConfirmationModal from './status-confirmation-modal'
import DeleteTeacherModal from './delete-teacher'
import { useDeleteTeacher } from '@features/admin/hooks/useAdmin'

const TeacherAdminList = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const updateProfileMutation = useUpdateTeacherProfile()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const deleteTeacherMutation = useDeleteTeacher()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

  const statusValue = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined
  const handleEditStatusClick = record => {
    setSelectedTeacher(record)
    setEditModalVisible(true)
  }
  const handleDeleteStatusClick = record => {
    setSelectedTeacher(record)
    setDeleteModalVisible(true)
  }
  const handleDeleteStatusConfirm = async record => {
    console.log(record.ID)
    await deleteTeacherMutation.mutate(record.ID)
    setDeleteModalVisible(false)
    refetch()
  }
  const {
    data: { data: teachersResponse } = {},
    isLoading,
    refetch
  } = useTeachers({
    page: currentPage,
    limit: pageSize,
    search: searchText,
    status: statusValue
  })
  const totalItems = teachersResponse?.total || 0

  const handleSearch = e => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = value => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleStatusClick = record => {
    setSelectedTeacher(record)
    setIsModalVisible(true)
  }

  const handleConfirmStatusChange = async () => {
    if (selectedTeacher) {
      try {
        await updateProfileMutation.mutateAsync({
          userId: selectedTeacher.ID,
          userData: { status: !selectedTeacher.status }
        })
        refetch()
        setSelectedTeacher(null)
        message.success(
          `Teacher ${selectedTeacher.firstName + ' ' + selectedTeacher.lastName} status updated successfully!`
        )
      } catch (error) {
        console.error('Failed to update teacher status:', error)
        message.error('Failed to update teacher', error)
      }
    }

    setIsModalVisible(false)
  }

  const handleCancelModal = () => {
    setEditModalVisible(false)
    setSelectedTeacher(null)
    setIsModalVisible(false)
  }

  const handleCreateNewAccount = () => {
    setIsCreateModalVisible(true)
  }

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false)
    refetch()
    message.success('Teacher account created successfully!')
  }

  const columns = [
    {
      title: 'Teacher Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`
    },
    { title: 'Teacher ID', dataIndex: 'ID', key: 'id' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Roles',
      dataIndex: 'roleIDs',
      key: 'roleIDs',
      render: roles => (
        <>
          {roles.map(role => {
            const color = role === 'admin' ? 'red' : role === 'teacher' ? 'green' : 'blue'
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div
          className={`cursor-pointer rounded px-3 py-1 ${status ? 'bg-teal-500 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => handleStatusClick(record)}
        >
          {status ? 'Active' : 'Inactive'}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditStatusClick(record)}
            type="text"
            icon={<EditOutlined className="text-green-500" />}
          />
          <Button
            type="text"
            onClick={() => handleDeleteStatusClick(record)}
            icon={<DeleteOutlined className="text-red-500" />}
          />
        </Space>
      )
    }
  ]

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />

  useEffect(() => {
    if (Array.isArray(teachersResponse?.teachers)) {
      setTeachers(teachersResponse.teachers)
      console.log(teachersResponse)
    }
  }, [teachersResponse])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-2 text-sm text-gray-500">Dashboard / Teacher Account Management</div>
      <h1 className="mb-8 text-2xl font-bold">Teacher Account Management</h1>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative">
            <Input
              placeholder="Search by name, ID, email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full rounded-md shadow-sm md:w-56"
              onChange={handleSearch}
              value={searchText}
            />
          </div>
          <Select
            defaultValue="all"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{ width: 150 }}
            className="shadow-sm"
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </div>
        <Button type="primary" className="bg-blue-700 shadow-sm hover:bg-blue-800" onClick={handleCreateNewAccount}>
          Create New Account
        </Button>
      </div>
      <div className="rounded-lg bg-white shadow">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Spin indicator={antIcon} />
            <span className="ml-3 text-gray-500">Loading teacher accounts...</span>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              rowKey="ID"
              dataSource={teachers}
              pagination={false}
              rowClassName="hover:bg-gray-50"
              className="border-t border-gray-200"
            />
            <div className="flex flex-col items-center justify-between border-t p-4 md:flex-row">
              <div className="mb-4 text-sm text-gray-500 md:mb-0">
                Showing {teachers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
              </div>
              <Pagination
                current={teachersResponse.pagination.page}
                onChange={handlePageChange}
                total={teachersResponse.pagination.total}
                pageSize={teachersResponse.pagination.limit}
                showSizeChanger={false}
                itemRender={(page, type, originalElement) => {
                  if (type === 'page') {
                    return (
                      <Button
                        type={page === currentPage ? 'primary' : 'default'}
                        className={page === currentPage ? 'bg-blue-700 hover:bg-blue-800' : 'bg-white hover:bg-gray-50'}
                      >
                        {page}
                      </Button>
                    )
                  }
                  return originalElement
                }}
              />
            </div>
          </>
        )}
      </div>

      <StatusConfirmationModal
        isVisible={isModalVisible}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmStatusChange}
        teacherName={
          selectedTeacher?.firstName && selectedTeacher?.lastName
            ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
            : selectedTeacher?.name
        }
        currentStatus={selectedTeacher?.status}
      />
      <EditTeacherModal
        isVisible={editModalVisible}
        onCancel={handleCancelModal}
        onSave={() => setEditModalVisible(false)}
        teacherId={selectedTeacher?.ID}
      />
      <DeleteTeacherModal
        isOpen={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false)
        }}
        onConfirm={() => handleDeleteStatusConfirm(selectedTeacher)}
      />

      <CreateTeacher open={isCreateModalVisible} onClose={handleCreateModalCancel} onSave={handleCreateSuccess} />
    </div>
  )
}

export default TeacherAdminList
