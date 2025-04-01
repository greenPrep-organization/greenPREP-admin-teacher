import { UserOutlined } from '@ant-design/icons'
import { useUserProfile } from '@features/profile/api/profileAPI'
import { Avatar, Button, Card, Divider, Input, message, Modal, Spin } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  const { userId } = useParams()
  const { data: userData, isLoading, isError } = useUserProfile(userId || '1')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    message.error('Unable to load profile information. Please try again later.')
    return null
  }

  // Khởi tạo formData nếu chưa có
  if (userData && !formData.firstName) {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.personalEmail,
      phone: userData.phone
    })
  }

  const handleEdit = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.personalEmail,
      phone: userData.phone
    })
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
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600">{formData.email}</p>
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
            <p className="capitalize text-gray-500">{userData.roleIDs}</p>
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
            <p className="text-gray-500">{formData.phone}</p>
          </div>
        </div>
      </Card>

      <Modal title="Edit Profile" open={isEditModalOpen} onOk={handleSave} onCancel={() => setIsEditModalOpen(false)}>
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
          <label className="block text-sm font-semibold">Phone:</label>
          <Input
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          />
          {/* Phone number validation message */}
          <div className="mt-2 text-sm text-gray-600">
            {/* Validate phone number format */}
            {!/^\+?\d{10,15}$/.test(formData.phone) && formData.phone.length > 0 ? (
              <p className="text-red-500">Please enter a valid phone number (10 digits).</p>
            ) : (
              formData.phone.length > 0 && <p className="text-green-500">Phone number looks good!</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile
