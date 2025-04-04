import { Modal, Form, Input, Button } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

export const CreateTeacher = ({ open, onClose }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
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
          >
            <Input placeholder="Enter first name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<span>Last name</span>}
            rules={[{ required: true, message: 'Please input last name!' }]}
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
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Enter email" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>

          <Form.Item
            name="teacherId"
            label={<span>Teacher ID</span>}
            rules={[{ required: true, message: 'Please input teacher ID!' }]}
          >
            <Input placeholder="Enter teacher ID" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
          </Form.Item>
        </div>

        <Form.Item
          name="password"
          label={<span>Password</span>}
          rules={[{ required: true, message: 'Please input password!' }]}
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
