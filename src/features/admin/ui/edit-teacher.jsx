import { useTeacherProfile, useUpdateTeacherProfile } from '@features/admin/api'
import { Input, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required')
})

const EditTeacherModal = ({ isVisible, teacherId, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const { data: singleTeacherData } = useTeacherProfile(teacherId)
  const updateProfileMutation = useUpdateTeacherProfile()

  useEffect(() => {
    if (singleTeacherData) {
      setFormData({
        firstName: singleTeacherData.firstName,
        lastName: singleTeacherData.lastName,
        email: singleTeacherData.email,
        phone: singleTeacherData.phone
      })
    }
  }, [singleTeacherData])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      if (formData.phone.length !== 10) {
        message.error('Phone number must have 10 digits')
        return
      }

      await profileValidationSchema.validate(formData, { abortEarly: false })

      await updateProfileMutation.mutateAsync({
        userId: teacherId,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        }
      })

      message.success('Teacher updated successfully!')
      onSave() // Callback to refetch data and close modal
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

  return (
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
            Phone number <span className="text-red-500">*</span>
          </label>
          <Input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full" />
        </div>
      </div>
    </Modal>
  )
}

export default EditTeacherModal
