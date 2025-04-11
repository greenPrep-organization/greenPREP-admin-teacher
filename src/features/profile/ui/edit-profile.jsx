import { Form, Input, Modal, Button } from 'antd'
import { EMAIL_REG, PHONE_REG } from '@/shared/lib/constants/reg'

const EditProfileModal = ({ open, onCancel, onSave, formData, setFormData }) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title={<div className="text-center text-2xl font-semibold">Update Profile</div>}
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end space-x-4">
          <Button key="cancel" onClick={onCancel} className="h-10 w-24 border border-[#D1D5DB] text-[#374151]">
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.validateFields().then(values => {
                onSave(values)
              })
            }}
            className="h-10 w-24 bg-[#003087] hover:bg-[#003087]/90"
          >
            Update
          </Button>
        </div>
      }
      width={500}
      maskClosable={false}
      className="edit-profile-modal"
    >
      <Form form={form} layout="vertical" initialValues={formData} className="px-4">
        <div className="flex gap-4">
          <Form.Item
            label={<span>First Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'First name is required' }]}
            className="flex-1"
            hasFeedback
          >
            <Input
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
            />
          </Form.Item>

          <Form.Item
            label={<span>Last Name</span>}
            name="lastName"
            rules={[{ required: true, message: 'Last name is required' }]}
            className="flex-1"
            hasFeedback
          >
            <Input
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span>Email</span>}
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { pattern: EMAIL_REG, message: 'Invalid email format' }
          ]}
          hasFeedback
        >
          <Input
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ pattern: PHONE_REG, message: 'Invalid phone number (e.g. 0987654321)' }]}
          hasFeedback
        >
          <Input
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
            className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditProfileModal
