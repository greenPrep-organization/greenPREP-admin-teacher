import { useTeacherProfile, useUpdateTeacherProfile } from '@features/admin/api'
import ResetPasswordModal from '@features/admin/ui/reset-password'
import { EMAIL_REG, PHONE_REG } from '@shared/lib/constants/reg'
import { Button, Input, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().matches(EMAIL_REG, 'Invalid email format').required('Email is required'),
  phone: Yup.string().matches(PHONE_REG, 'Phone number is not valid').required('Phone number is required')
})

const EditTeacherModal = ({ isVisible, teacherId, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    teacherCode: ''
  })
  const { data: singleTeacherData } = useTeacherProfile(teacherId)
  const updateProfileMutation = useUpdateTeacherProfile()
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false)

  useEffect(() => {
    if (singleTeacherData) {
      setFormData({
        firstName: singleTeacherData.firstName,
        lastName: singleTeacherData.lastName,
        email: singleTeacherData.email,
        phone: singleTeacherData.phone,
        teacherCode: singleTeacherData.teacherCode
      })
    }
  }, [singleTeacherData])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await profileValidationSchema.validate(formData, { abortEarly: false })

      await updateProfileMutation.mutateAsync({
        userId: teacherId,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          teacherCode: formData.teacherCode
        }
      })

      message.success('Teacher updated successfully!')
      onSave()
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to update teacher')
      } else if (error.inner) {
        error.inner.forEach(err => {
          message.error(err.message)
        })
      } else {
        message.error('Failed to update teacher')
      }
    }
  }

  const handleResetPassword = () => {
    setResetPasswordModalVisible(true)
  }

  return (
    <>
      <Modal
        title="Edit Teacher"
        open={isVisible}
        onOk={handleSave}
        onCancel={onCancel}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={updateProfileMutation.isPending}
        width={600}
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First name <span className="text-red-500">*</span>
              </label>
              <Input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full" />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last name <span className="text-red-500">*</span>
              </label>
              <Input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input name="email" value={formData.email} onChange={handleInputChange} className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teacher ID <span className="text-red-500">*</span>
            </label>
            <Input name="teacherCode" value={formData.teacherCode} onChange={handleInputChange} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone number <span className="text-red-500">*</span>
            </label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full" />
          </div>
          <Button
            type="link"
            onClick={handleResetPassword}
            className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white"
          >
            Reset Password
          </Button>
        </div>
      </Modal>
      <ResetPasswordModal
        isVisible={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onResetSuccess={() => setResetPasswordModalVisible(false)}
      />
    </>
  )
}

export default EditTeacherModal
