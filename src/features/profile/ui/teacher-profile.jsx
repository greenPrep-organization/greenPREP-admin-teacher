import { UserOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Button, Card, Divider, Input, message, Modal, Spin } from 'antd'
import { useState } from 'react'

const mockUserData = {
  firstName: 'Phung',
  lastName: 'H',
  fullName: 'Phung H',
  email: '1234@gmail.com',
  personalEmail: 'QWER@gmail.com',
  phone: 'M Hehe',
  role: 'Teacher',
  classes: ['CLASS01', 'CLASS02'],
  avatar: null
}

const fetchUserProfile = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUserData)
    }, 1000)
  })
}

const TeacherProfile = ({ userId }) => {
  const {
    data: userData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId)
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [isUpdated, setIsUpdated] = useState(false)

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )

  if (isError) {
    message.error('Unable to load profile information. Please try again later.')
    return null
  }

  const handleEdit = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.personalEmail,
      phone: userData.phone
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    setIsModalOpen(false)
    setIsUpdated(true)
    message.success('Profile updated successfully!')
    refetch()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Profile</h1>
      <Card className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar size={100} icon={<UserOutlined />} className="bg-gray-800" />
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-600">{userData.personalEmail}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="primary" className="bg-blue-800 hover:bg-blue-700" size="large">
              Change Password
            </Button>
            <Button
              type="default"
              size="large"
              style={{ backgroundColor: isUpdated ? '#003087' : '', color: isUpdated ? 'white' : '' }}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Role</p>
            <p className="text-gray-500">{userData.role}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Classes</p>
            {userData.classes.map((cls, index) => (
              <p key={index} className="text-gray-500">
                {cls}
              </p>
            ))}
          </div>
        </div>
        <Divider className="my-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Phone number</p>
            <p className="text-gray-500">{userData.phone}</p>
          </div>
        </div>
      </Card>
      <Modal title="Edit Profile" visible={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <div>
          <label>First Name:</label>
          <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
        </div>
        <div>
          <label>Last Name:</label>
          <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
        </div>
        <div>
          <label>Email:</label>
          <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div>
          <label>Phone:</label>
          <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}

export default TeacherProfile
