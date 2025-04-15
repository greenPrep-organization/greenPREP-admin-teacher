// @ts-nocheck
import { CalendarOutlined } from '@ant-design/icons'
import { generationKey, getTestSets } from '@features/session/api'
import { useCreateSession } from '@features/session/hooks'
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'

export default function CreateSessionModal({ open, onClose, classId }) {
  const { mutateAsync, isLoading } = useCreateSession(classId)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [testSets, setTestSets] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchTestSets = async () => {
      try {
        const res = await getTestSets()
        setTestSets(res.data || [])
      } catch (error) {
        console.error('Failed to fetch test sets:', error)
      }
    }

    fetchTestSets()
  }, [])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const startTime = values.startDate.toDate()
      const endTime = values.endDate.toDate()
      const now = new Date()
      let status
      if (now >= endTime) {
        status = 'COMPLETE'
      } else if (now >= startTime && now < endTime) {
        status = 'IN_PROGRESS'
      } else if (now < startTime) {
        status = 'NOT_STARTED'
      }

      const payload = {
        ...values,
        startTime: startDate?.toISOString(),
        endTime: endDate?.toISOString(),
        ClassID: classId,
        Status: status
      }
      await mutateAsync(payload)
      message.success('Session created successfully!')
      onClose()
      form.resetFields()
    } catch (err) {
      message.error('Failed to create session', err)
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
        <Form.Item label="Session Key" required style={{ marginBottom: 0 }}>
          <div className="flex gap-2 pb-5">
            <Form.Item
              name="sessionKey"
              rules={[
                { required: true, message: 'Please generate session key' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
              ]}
              noStyle
            >
              <Input
                disabled
                placeholder="Generate session key"
                className="h-11 w-full rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3"
              />
            </Form.Item>

            <Button
              type="primary"
              className="h-11 bg-[#003087] px-4 text-white hover:bg-[#003087]/90"
              onClick={async () => {
                try {
                  const res = await generationKey()
                  const generatedKey = res.key
                  form.setFieldsValue({ sessionKey: generatedKey })
                  message.success('Session key generated!')
                } catch (error) {
                  message.error('Failed to generate session key!', error)
                }
              }}
            >
              Generate
            </Button>
          </div>
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
                  if (value && startDate && value.isBefore(startDate, 'minute')) {
                    return Promise.reject('End date cannot be before start date!')
                  }
                  if (value.isSame(startDate, 'minute')) {
                    return Promise.reject('End date cannot be the same as start date!')
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
              <Select.Option key={testSet.ID} value={testSet.ID}>
                {testSet.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
