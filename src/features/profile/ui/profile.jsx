import { useChangeUserPassword, useUpdateUserProfile, useUserProfile } from '@features/profile/hooks/useProfile'
import ChangePasswordModal from '@features/profile/ui/change-password-profile'
import EditProfileModal from '@features/profile/ui/edit-profile'
import { EMAIL_REG, PHONE_REG } from '@shared/lib/constants/reg'
import { Avatar, Button, Card, Divider, message, Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().matches(EMAIL_REG, 'Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(PHONE_REG, { message: 'Invalid phone number format' })
    .required('Phone number is required')
})

const Profile = () => {
  // @ts-ignore
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
  // eslint-disable-next-line no-unused-vars
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

  const handleSave = async () => {
    try {
      if (formData.phone.length < 10 || formData.phone.length > 10) {
        message.error('Phone number must have 10 digits')
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

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Profile</h1>
      <Card className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-gray-400 text-4xl font-bold text-black md:h-24 md:w-24 md:rounded-[50%]">
            {userData?.lastName?.charAt(0)}
          </Avatar>
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
            <p className="text-gray-500">{userData.phone}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Teacher Code</p>
            <p className="text-gray-500">{userData.teacherCode}</p>
          </div>
        </div>
      </Card>

      <EditProfileModal
        open={isEditModalOpen}
        onCancel={handleCancelEdit}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        userId={auth.user?.userId}
        onSubmit={async (userId, passwordData) => {
          try {
            await changePasswordMutation.mutateAsync({ userId, passwordData })
            setIsPasswordModalOpen(false)
            window.location.reload()
          } catch (error) {
            if (error.response) {
              message.error(error.response.data.message || 'Failed to change password')
            } else {
              message.error('Failed to change password')
            }
          }
        }}
      />
    </div>
  )
}

export default Profile
