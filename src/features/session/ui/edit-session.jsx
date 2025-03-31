import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import * as yup from 'yup'
import { CalendarOutlined } from '@ant-design/icons'
import { editSessionSchema } from '@/features/session/validations/edit-session.schema'

const EditSession = ({ open, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startTime ? dayjs(initialValues.startTime) : null,
        endDate: initialValues.endTime ? dayjs(initialValues.endTime) : null
      })
    }
  }, [initialValues, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await editSessionSchema.validate(values, { abortEarly: false })

      onUpdate({
        ...values,
        startTime: values.startDate.toDate(),
        endTime: values.endDate.toDate()
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const formErrors = {}
        error.inner.forEach(err => {
          formErrors[err.path] = err.message
        })
        form.setFields(
          Object.entries(formErrors).map(([name, errors]) => ({
            name,
            errors: [errors]
          }))
        )
      }
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title={<div className="text-center text-2xl font-semibold">Edit session</div>}
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex justify-center space-x-4">
          <Button key="cancel" onClick={onCancel} className="h-10 w-24 border border-[#D1D5DB] text-[#374151]">
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            className="h-10 w-24 bg-[#003087] hover:bg-[#003087]/90"
          >
            Update
          </Button>
        </div>
      }
      width={500}
      maskClosable={false}
      className="edit-session-modal"
    >
      <Form form={form} layout="vertical" className="px-4">
        <Form.Item
          name="name"
          label={
            <span>
              Session name <span className="text-red-500">*</span>
            </span>
          }
        >
          <Input placeholder="Enter session name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="key"
          label={
            <span>
              Session key <span className="text-red-500">*</span>
            </span>
          }
        >
          <Input placeholder="Enter session key" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startDate"
            label={
              <span>
                Start date <span className="text-red-500">*</span>
              </span>
            }
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select start date"
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label={
              <span>
                End date <span className="text-red-500">*</span>
              </span>
            }
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select end date"
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default EditSession
