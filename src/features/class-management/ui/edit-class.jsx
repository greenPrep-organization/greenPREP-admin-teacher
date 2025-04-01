import { useEffect } from 'react'
import { Modal, Input, message, Button, Form, Typography } from 'antd'

const { Title } = Typography

const EditClassModal = ({ visible, onClose, onSave, className, existingClasses = [] }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ className: className || '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className])

  const validateClassName = (_, value) => {
    if (!value?.trim()) return Promise.reject(new Error('Class name cannot be empty!'))
    if (value.length < 3 || value.length > 50)
      return Promise.reject(new Error('Class name must be between 3 and 50 characters!'))

    const isDuplicate = existingClasses.some(
      cls => cls.className.toLowerCase() === value.toLowerCase() && cls.className !== className
    )

    if (isDuplicate) return Promise.reject(new Error('Class name already exists!'))

    return Promise.resolve()
  }

  const handleSave = async () => {
    try {
      const { className: newClassName } = await form.validateFields()
      onSave(newClassName.trim())
      onClose()
    } catch {
      message.error('Please fix the errors before saving.')
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave} style={{ backgroundColor: '#003087' }}>
          Update
        </Button>
      ]}
      title={
        <Title level={2} style={{ textAlign: 'center' }}>
          Edit class
        </Title>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              Class name <span style={{ color: 'red' }}>*</span>
            </span>
          }
          name="className"
          rules={[{ validator: validateClassName }]}
        >
          <Input placeholder="Enter new class name" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditClassModal
