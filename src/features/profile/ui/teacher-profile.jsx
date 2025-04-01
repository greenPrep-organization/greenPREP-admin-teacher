import { UserOutlined } from '@ant-design/icons'
import { useUserProfile } from '@features/profile/api/profileAPI'
import { Avatar, Button, Card, Divider, Input, message, Modal, Spin } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

// Validation schema for profile update
const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
    .required('Phone number is required')
})

// Validation schema for change password
const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const TeacherProfile = () => {
  const { userId } = useParams()
  const { data: userData, isLoading, isError } = useUserProfile(userId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

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
      // Cập nhật dữ liệu hiển thị (dữ liệu fake chỉ dùng cho test)
      // Trong thực tế, bạn sẽ gọi API cập nhật và sau đó refetch hoặc cập nhật state
    } catch (error) {
      error.inner.forEach(err => {
        message.error(err.message)
      })
    }
  }

  const openChangePassword = () => {
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setIsPasswordModalOpen(true)
  }

  const handleChangePassword = async () => {
    try {
      await passwordValidationSchema.validate(passwordData, { abortEarly: false })
      setIsPasswordModalOpen(false)
      message.success('Password changed successfully!')
      // Ở đây bạn có thể gọi API để thay đổi mật khẩu
    } catch (error) {
      error.inner.forEach(err => {
        message.error(err.message)
      })
    }
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
            <Button type="primary" className="bg-blue-800 hover:bg-blue-700" size="large" onClick={openChangePassword}>
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

      {/* Modal for Edit Profile */}
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
          <label>Phone:</label>
          <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </Modal>

      {/* Modal for Change Password */}
      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onOk={handleChangePassword}
        onCancel={() => setIsPasswordModalOpen(false)}
      >
        <div>
          <label>Old Password:</label>
          <Input.Password
            value={passwordData.oldPassword}
            onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>New Password:</label>
          <Input.Password
            value={passwordData.newPassword}
            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Confirm Password:</label>
          <Input.Password
            value={passwordData.confirmPassword}
            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  )
}

export default TeacherProfile
