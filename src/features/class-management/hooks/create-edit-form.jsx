import { Form, Input, Button, message } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateClass, createClass } from '@features/class-management/api'
import { useEffect } from 'react'

const ClassForm = ({ initialData, onSuccess, isEditMode, onClose }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isEditMode && initialData) {
      form.setFieldsValue({ className: initialData.className })
    }
  }, [initialData, isEditMode, form])

  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      message.success('Class created successfully!')
      form.resetFields()
      onSuccess()
      onClose()
    },
    onError: () => {
      message.error('Existed class name. Failed to create class!')
    }
  })

  const updateClassMutation = useMutation({
    // @ts-ignore
    mutationFn: ({ id, className }) => updateClass(id, { className }),
    onSuccess: () => {
      message.success('Class updated successfully!')
      // @ts-ignore
      queryClient.invalidateQueries(['classes'])
      onSuccess()
      onClose()
    },
    onError: () => {
      message.error('Existed class name. Failed to update class!')
    }
  })

  const handleSubmit = async values => {
    if (isEditMode) {
      // @ts-ignore
      updateClassMutation.mutate({ id: initialData.ID, className: values.className })
    } else {
      createClassMutation.mutate(values)
    }
  }

  return (
    <Form
      form={form}
      initialValues={initialData || {}}
      onFinish={handleSubmit}
      layout="vertical"
      requiredMark="optional"
      className="w-full max-w-md"
    >
      <Form.Item
        name="className"
        label={
          <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Class name <span style={{ color: 'red' }}>*</span>
          </span>
        }
        rules={[
          { required: true, message: 'Class name is required!' },
          { min: 3, message: 'Class name should be at least 3 characters' },
          { max: 50, message: 'Class name cannot exceed 50 characters' }
        ]}
      >
        <Input placeholder="Enter class name" />
      </Form.Item>

      <div className="flex justify-end gap-4">
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: '#003087' }}
          // @ts-ignore
          loading={isEditMode ? updateClassMutation.isLoading : createClassMutation.isLoading}
        >
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}

export default ClassForm
