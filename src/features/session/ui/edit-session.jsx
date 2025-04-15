import { generationKey } from '@/features/session/api'
import { editSessionSchema } from '@/features/session/validations/edit-session.schema'
import { CalendarOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import * as yup from 'yup'

const EditSession = ({ open, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startTime ? dayjs(initialValues.startTime) : null,
        endDate: initialValues.endTime ? dayjs(initialValues.endTime) : null,
        status: initialValues.status
      })
    }
  }, [initialValues, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await editSessionSchema.validate(values, { abortEarly: false })

      const startTime = values.startDate.toDate()
      const endTime = values.endDate.toDate()
      const now = new Date()

      let Status
      if (now >= endTime) {
        Status = 'COMPLETE'
      } else if (now >= startTime && now < endTime) {
        Status = 'IN_PROGRESS'
      } else {
        Status = 'NOT_STARTED'
      }

      onUpdate({
        name: values.name,
        key: values.key,
        startTime: values.startDate.toDate(),
        endTime: values.endDate.toDate(),
        status: Status
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
        <div className="flex justify-end space-x-4">
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

        <Form.Item label="Session key" required style={{ marginBottom: 0 }}>
          <div className="flex gap-2 pb-5">
            <Form.Item
              name="key"
              rules={[
                { required: true, message: 'Please generate session key' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
              ]}
              noStyle
            >
              <Input
                disabled
                placeholder="Generate session key"
                className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3 !text-black !opacity-100"
              />
            </Form.Item>
            <Button
              type="primary"
              className="h-11 bg-[#003087] px-4 text-white hover:bg-[#003087]/90"
              onClick={async () => {
                try {
                  const res = await generationKey()
                  const generatedKey = res.key
                  form.setFieldsValue({ key: generatedKey })
                } catch (error) {
                  console.error('Failed to generate session key!', error)
                }
              }}
            >
              Generate
            </Button>
          </div>
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
