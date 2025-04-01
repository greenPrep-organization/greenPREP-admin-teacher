import { Modal, Input, Form, Button, message, Typography } from 'antd'
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClass } from '@features/class-management/api/classes'

const { Title } = Typography

const CreateClassModal = ({ visible, onClose, existingClasses = [] }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const createClassMutation = useMutation({
    mutationFn: createClass,
    // eslint-disable-next-line no-unused-vars
    onSuccess: newClass => {
      // @ts-ignore
      queryClient.invalidateQueries(['classes'])
      message.success('Class created successfully!')
      form.resetFields()
      onClose()
    },
    onError: error => {
      message.error(error.message || 'Failed to create class!')
    }
  })

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setLoading(false)
    }
  }, [visible, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const className = values.className?.trim() || ''

      if (!className) {
        message.error('Class name cannot be empty!')
        return
      }
      if (className.length < 3 || className.length > 50) {
        message.error('Class name must be between 3 and 50 characters')
        return
      }
      if (existingClasses.some(cls => cls.className?.toLowerCase() === className.toLowerCase())) {
        message.error('Class name already exists!')
        return
      }

      setLoading(true)
      createClassMutation.mutate({ className })
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error('Please enter a valid class name!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      centered
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk} style={{ backgroundColor: '#003087' }}>
          Create
        </Button>
      ]}
      title={
        <Title level={2} style={{ textAlign: 'center' }}>
          Create new class
        </Title>
      }
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          label={
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              Class name <span style={{ color: 'red' }}>*</span>
            </span>
          }
          name="className"
          rules={[{ required: true, message: 'Please enter class name' }]}
        >
          <Input placeholder="Enter class name" disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateClassModal
