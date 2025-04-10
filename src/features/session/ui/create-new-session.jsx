// @ts-nocheck
import { CalendarOutlined } from '@ant-design/icons'
import { useCreateSession } from '@features/session/hooks'
import { Button, DatePicker, Form, Input, Modal, Select, notification } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function CreateSessionModal1({ open, onClose, classId }) {
  const { mutateAsync, isLoading } = useCreateSession(classId)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [form] = Form.useForm()

  const testSets = [
    {
      id: '280e1fd9-df60-40a1-ac18-d456fe8d2bf9',
      name: 'Test Set 1'
    },
    {
      id: 2,
      name: 'Test Set 2'
    },
    {
      id: 3,
      name: 'Test Set 3'
    },
    {
      id: 4,
      name: 'Test Set 4'
    }
  ]

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        startTime: startDate?.toISOString(),
        endTime: endDate?.toISOString(),
        ClassID: classId,
        Status: 'NOT_STARTED'
      }
      await mutateAsync(payload)
      notification.success({
        message: (
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium text-[#1D1C20]">Create Session Successfully</div>
              <div className="text-[13px] text-[#00000073]">Your session has been created</div>
            </div>
          </div>
        ),
        placement: 'topRight',
        duration: 3,
        className: 'custom-notification-success'
      })
      onClose()
      form.resetFields()
    } catch (err) {
      console.error(err)
      notification.error({
        message: 'Failed to create session',
        description: err.response?.data?.message || err.message || 'Please check your input and try again',
        placement: 'topRight',
        duration: 3
      })
    }
  }

  const handleEndDateChange = date => {
    if (startDate && date && date.isBefore(startDate)) {
      setEndDate(startDate)
    } else {
      setEndDate(date)
    }
  }

  return (
    <Modal
      open={open}
      title={<div className="text-center text-2xl font-semibold">Create new session</div>}
      onCancel={() => {
        onClose()
        form.resetFields()
      }}
      width={500}
      maskClosable={false}
      className="create-session-modal"
      footer={
        <div className="flex justify-end space-x-4">
          <Button key="cancel" onClick={onClose} className="h-10 w-24 border border-[#D1D5DB] text-[#374151]">
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            className="h-10 w-24 bg-[#003087] hover:bg-[#003087]/90"
          >
            Create
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="px-4">
        <Form.Item
          name="sessionName"
          label={<span>Session name</span>}
          rules={[
            { required: true, message: 'Please input session name' },
            { max: 100, message: 'Name must be less than 100 characters' }
          ]}
        >
          <Input placeholder="Enter session name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="sessionKey"
          label={<span>Session key</span>}
          rules={[
            { required: true, message: 'Please input session key' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
          ]}
        >
          <Input placeholder="Enter session key" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="examSet"
          label={<span>Test set</span>}
          rules={[{ required: true, message: 'Please select a test set' }]}
        >
          <Select placeholder="Choose the test set" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB]">
            {testSets?.map(testSet => (
              <Select.Option key={testSet.id} value={testSet.id}>
                {testSet.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startDate"
            label={<span>Start date</span>}
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              onChange={date => setStartDate(date)}
              placeholder="Select start date"
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label={<span>End date</span>}
            rules={[
              { required: true, message: 'Please select end date' },
              {
                validator: (_, value) => {
                  if (value && startDate && value.isBefore(startDate)) {
                    return Promise.reject('End date cannot be before start date!')
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select end date"
              onChange={handleEndDateChange}
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
