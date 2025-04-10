// @ts-nocheck
import { CalendarOutlined } from '@ant-design/icons'
import { useCreateSession } from '@features/session/hooks'
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'

export default function CreateSessionModal1({ open, onClose, classId }) {
  const { mutateAsync, isLoading } = useCreateSession(classId)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [form] = Form.useForm()

  const testSets = [
    {
      id: 1,
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
      onClose()
      form.resetFields()
    } catch (err) {
      console.error(err)
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
      footer={[
        <>
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
        </>
      ]}
    >
      <Form form={form} layout="vertical" className="px-4">
        <Form.Item
          name="sessionName"
          label="Session Name"
          rules={[{ required: true, message: 'Please enter session name' }]}
        >
          <Input placeholder="Enter session name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>
        <Form.Item
          name="sessionKey"
          label="Session Key"
          rules={[
            { required: true, message: 'Please input session key' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
          ]}
        >
          <Input placeholder="Enter session key" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Please select start time!' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              onChange={date => setStartDate(date)}
              placeholder="Select start date"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
            />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: 'Please select end time!' },
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
              format="YYYY-MM-DD HH:mm"
              placeholder="Select end date"
              onChange={handleEndDateChange}
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
              className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
            />
          </Form.Item>
        </div>

        <Form.Item label="Exam Set" name="examSet" rules={[{ required: true, message: 'Please select exam set!' }]}>
          <Select placeholder="Select exam set">
            {testSets?.map(testSet => (
              <Select.Option key={testSet.id} value={testSet.id}>
                {testSet.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
