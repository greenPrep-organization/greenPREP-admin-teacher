import { UserOutlined } from '@ant-design/icons'
import { useUserProfile } from '@features/profile/api/profileAPI'
import { Avatar, Button, Card, Divider, Input, message, Modal, Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
    .required('Phone number is required')
})

const Profile = () => {
  const auth = useSelector(state => state.auth)
  console.log(auth.user)
  const { data: userData, isLoading, isError } = useUserProfile(auth.user?.userId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  // Initialize form data when userData is available
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || ''
      })
    }
  }, [userData])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !userData) {
    message.error('Unable to load profile information. Please try again later.')
    return null
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleSave = async () => {
    try {
      await profileValidationSchema.validate(formData, { abortEarly: false })
      setIsEditModalOpen(false)
      message.success('Profile updated successfully!')
    } catch (error) {
      error.inner.forEach(err => {
        message.error(err.message)
      })
    }
  }

  const handleChangePassword = async () => {
    message.info('Change Password')
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
            <p className="text-gray-600">{userData.email}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="primary"
              className="bg-blue-800 hover:bg-blue-700"
              size="large"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
            <Button type="default" size="large" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Role</p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(userData.role) ? (
                userData.role.map((role, index) => (
                  <Tag key={index} className="capitalize">
                    {role}
                  </Tag>
                ))
              ) : (
                <Tag className="capitalize">{userData.role || 'No role assigned'}</Tag>
              )}
            </div>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Classes</p>
            {userData.classes?.length > 0 ? (
              userData.classes.map((cls, index) => (
                <p key={index} className="text-gray-500">
                  {cls}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No classes assigned</p>
            )}
          </div>
        </div>
        <Divider className="my-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Phone number</p>
            <p className="text-gray-500">{userData.phone || 'Not provided'}</p>
          </div>
        </div>
      </Card>

      <Modal title="Edit Profile" open={isEditModalOpen} onOk={handleSave} onCancel={() => setIsEditModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block">First Name:</label>
            <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
          </div>
          <div>
            <label className="block">Last Name:</label>
            <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div>
            <label className="block">Email:</label>
            <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block">Phone:</label>
            <Input
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-11 digit phone number"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile
