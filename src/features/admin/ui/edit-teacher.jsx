import { useTeacherProfile, useUpdateTeacherProfile } from '@features/admin/api'
import ResetPasswordModal from '@features/admin/ui/reset-password-teacher'
import { EMAIL_REG, PHONE_REG } from '@shared/lib/constants/reg'
import { Button, Form, Input, message, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().matches(EMAIL_REG, 'Invalid email format').required('Email is required'),
  phone: Yup.string().matches(PHONE_REG, 'Phone number is not valid').required('Phone number is required')
})

const EditTeacherModal = ({ isVisible, teacherId, onCancel, onSave }) => {
  const [form] = Form.useForm()
  const { data: singleTeacherData } = useTeacherProfile(teacherId)
  const updateProfileMutation = useUpdateTeacherProfile()
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false)

  useEffect(() => {
    if (singleTeacherData) {
      form.setFieldsValue({
        firstName: singleTeacherData.firstName,
        lastName: singleTeacherData.lastName,
        email: singleTeacherData.email,
        phone: singleTeacherData.phone,
        teacherCode: singleTeacherData.teacherCode,
        roleIDs: singleTeacherData.roleIDs || []
      })
    }
  }, [singleTeacherData, form])

  const handleSave = async () => {
    try {
      await form.validateFields()
      await profileValidationSchema.validate(form.validateFields, { abortEarly: false })
      const values = form.getFieldsValue()
      await updateProfileMutation.mutateAsync({
        userId: teacherId,
        userData: values
      })

      message.success('Teacher updated successfully!')
      onSave()
    } catch (err) {
      console.error(err)
      message.error('Failed to update teacher')
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
        <Form form={form} layout="vertical" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input className="w-full" />
              </Form.Item>
            </div>

            <div className="flex-1">
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input className="w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { pattern: EMAIL_REG, message: 'Invalid email format' }
            ]}
            hasFeedback
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Teacher ID"
            name="teacherCode"
            rules={[
              { required: true, message: 'Teacher ID is required' },
              { pattern: /^TC\d{5}$/, message: 'Teacher ID must start with TC followed by 5 digits' }
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: 'Phone number is required' },
              { pattern: PHONE_REG, message: 'Phone number is not valid' }
            ]}
            hasFeedback
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item label="Role" name="roleIDs">
            <Select
              className="w-full"
              mode="multiple"
              options={[{ label: 'admin', value: 'admin' }]}
              placeholder="Select roles"
            />
          </Form.Item>

          <Button
            type="link"
            onClick={handleResetPassword}
            className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white"
          >
            Reset Password
          </Button>
        </Form>
      </Modal>
      <ResetPasswordModal
        email={form.getFieldValue('email')}
        isVisible={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onResetSuccess={() => setResetPasswordModalVisible(false)}
      />
    </>
  )
}

export default EditTeacherModal
