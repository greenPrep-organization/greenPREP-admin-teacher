import { useCreateTeacher } from '@/features/admin/api'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { EMAIL_REG, PASSWORD_REG, PHONE_REG } from '@shared/lib/constants/reg'
import { Button, Form, Input, message, Modal } from 'antd'
import * as Yup from 'yup'

const teacherValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().matches(EMAIL_REG, 'Invalid email format').required('Email is required'),
  phone: Yup.string().matches(PHONE_REG, 'Phone number is not valid').required('Phone number is required')
})

export const CreateTeacher = ({ open, onClose, onSave }) => {
  const [form] = Form.useForm()
  // @ts-ignore
  const { mutate: createTeacher, isLoading, error } = useCreateTeacher()

  const handleSubmit = async () => {
    try {
      const formData = form.getFieldsValue()
      await teacherValidationSchema.validate(formData, { abortEarly: false })
      const teacherData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        teacherCode: formData.teacherId,
        roleIDs: ['teacher'],
        class: '',
        phone: ''
      }
      await createTeacher(teacherData)
      form.resetFields()
      onSave()
      onClose()
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach(err => {
          message.error(err.message)
        })
      } else {
        message.error(`Error in submitting form: ${error.message || 'Unknown error'}`)
      }
    }
  }

  return (
    <Modal
      title={<div className="pb-4 text-center text-2xl font-semibold">Create New Account</div>}
      open={open}
      onCancel={onClose}
      footer={
        <div className="flex justify-end space-x-4">
          <Button key="cancel" onClick={onClose} className="h-10 w-24 border border-[#D1D5DB] text-[#374151]">
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            className="h-10 w-24 bg-[#003087] hover:bg-[#003087]/90"
            loading={isLoading}
            onError={() => {
              console.error('Error creating teacher:', error)
            }}
          >
            Create
          </Button>
        </div>
      }
      width={600}
      maskClosable={false}
      className="create-teacher-modal"
    >
      <Form form={form} layout="vertical" className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label={<span>First name</span>}
            rules={[{ required: true, message: 'Please input first name!' }]}
            hasFeedback
          >
            <Input placeholder="Enter first name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<span>Last name</span>}
            rules={[{ required: true, message: 'Please input last name!' }]}
            hasFeedback
          >
            <Input placeholder="Enter last name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={<span>Email</span>}
            rules={[
              { required: true, message: 'Please input email!' },
              { pattern: EMAIL_REG, type: 'email', message: 'Please enter a valid email!' }
            ]}
            hasFeedback
          >
            <Input placeholder="Enter email" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>

          <Form.Item
            name="teacherId"
            label={<span>Teacher ID</span>}
            rules={[
              { required: true, message: 'Please input teacher ID!' },
              { pattern: /^TC\d{5}$/, message: 'Teacher ID must start with TC followed by 5 digits' }
            ]}
            hasFeedback
          >
            <Input placeholder="Enter teacher ID" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>
        </div>

        <Form.Item
          name="phone"
          label={<span>Phone</span>}
          rules={[
            {
              required: true,
              message: 'Please input your phone number!'
            },
            {
              pattern: PHONE_REG,
              message: 'Phone number must be at least 10 digits long and contain only numbers.'
            }
          ]}
          hasFeedback
        >
          <Input placeholder="Enter phone number" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span>Password</span>}
          rules={[
            { required: true, message: 'Please input password!' },
            {
              pattern: PASSWORD_REG,
              message:
                'Password more than 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
            }
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Enter password"
            className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
