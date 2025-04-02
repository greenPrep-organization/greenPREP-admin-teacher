import { UserOutlined } from '@ant-design/icons'
import { useChangeUserPassword, useUpdateUserProfile, useUserProfile } from '@features/profile/api/profileAPI'
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

const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const Profile = () => {
  const auth = useSelector(state => state.auth)
  const { data: userData, isLoading, isError, refetch } = useUserProfile(auth.user?.userId)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const updateProfileMutation = useUpdateUserProfile()
  const changePasswordMutation = useChangeUserPassword()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

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

  const handleEdit = () => {
    setFormData({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || ''
    })
    setIsEditModalOpen(true)
  }

  const handleCancelEdit = () => {
    setFormData({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || ''
    })
    setIsEditModalOpen(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    if (name === 'phone' && (value.length > 11 || value.length < 10)) {
      message.error('Phone number must have 10 digits')
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      if (formData.phone.length < 10 || formData.phone.length > 11) {
        message.error('Phone number must have 10-11 digits')
        return
      }
      await profileValidationSchema.validate(formData, { abortEarly: false })

      await updateProfileMutation.mutateAsync({
        userId: auth.user?.userId,
        userData: formData
      })

      message.success('Profile updated successfully!')
      refetch()
      setIsEditModalOpen(false)
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to update profile')
      } else if (error.inner) {
        error.inner.forEach(err => {
          message.error(err.message)
        })
      } else {
        message.error('Failed to update profile')
      }
    }
  }

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

  const openChangePassword = () => {
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setIsPasswordModalOpen(true)
  }

  const handleChangePassword = async () => {
    try {
      await passwordValidationSchema.validate(passwordData, { abortEarly: false })

      await changePasswordMutation.mutateAsync({
        userId: auth.user?.userId,
        passwordData: {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }
      })

      setIsPasswordModalOpen(false)
      message.success('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to change password')
      } else if (error.inner) {
        error.inner.forEach(err => {
          message.error(err.message)
        })
      } else {
        message.error('Failed to change password')
      }
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
              {userData?.firstName} {userData?.lastName}
            </h2>
            <p className="text-gray-600">{userData?.email}</p>
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
            <div className="flex flex-wrap gap-2">
              {Array.isArray(userData?.roleIDs) && userData?.roleIDs?.length > 0 ? (
                userData.roleIDs.map((role, index) => (
                  <p key={index} className="capitalize text-gray-500">
                    {role}
                  </p>
                ))
              ) : (
                <Tag className="capitalize">{userData?.role || 'No role assigned'}</Tag>
              )}
            </div>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Classes</p>
            {userData?.class ? (
              Array.isArray(userData.class) ? (
                userData.class.length > 0 ? (
                  userData.class.map((cls, index) => (
                    <p key={index} className="text-gray-500">
                      {cls}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">No classes assigned</p>
                )
              ) : (
                <p className="text-gray-500">{userData.class}</p>
              )
            ) : (
              <p className="text-gray-500">No classes assigned</p>
            )}
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

      <Modal title="Edit Profile" open={isEditModalOpen} onOk={handleSave} onCancel={handleCancelEdit}>
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
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10 digit phone number"
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onOk={handleChangePassword}
        onCancel={() => setIsPasswordModalOpen(false)}
      >
        <div>
          <label className="block text-sm font-semibold">Current Password:</label>
          <Input.Password
            value={passwordData.oldPassword}
            onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">New Password:</label>
          <Input.Password
            value={passwordData.newPassword}
            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          />
          {/* Password validation list */}
          <div className="mt-2 pl-6 text-sm text-gray-600">
            <ul>
              <li className={passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                Minimum 8 characters
              </li>
              <li className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-red-500'}>
                At least one uppercase letter
              </li>
              <li className={/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-red-500'}>
                At least one number
              </li>
              <li
                className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-red-500'}
              >
                At least one special character
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">Confirm Password:</label>
          <Input.Password
            value={passwordData.confirmPassword}
            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          />
          {passwordData.newPassword !== passwordData.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Profile
