// features/sessions/components/CreateSessionModal.jsx
import { Modal, Form, Input, Select, DatePicker, notification, Button } from 'antd'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { CalendarOutlined } from '@ant-design/icons'

const CreateSessionModal = ({ visible, onCancel, onSubmit, testSets }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const sessionData = {
        name: values.name,
        key: values.key,
        testSetId: values.testSetId,
        startTime: values.startDate.toDate(),
        endTime: values.endDate.toDate()
      }

      await onSubmit(sessionData)
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

      form.resetFields()
      onCancel()
    } catch (error) {
      console.error('Validation failed:', error)
      notification.error({
        message: 'Failed to create session',
        description: 'Please check your input and try again',
        placement: 'topRight',
        duration: 3
      })
    }
  }

  return (
    <Modal
      title={<div className="text-center text-2xl font-semibold">Create new session</div>}
      open={visible}
      onCancel={onCancel}
      width={500}
      maskClosable={false}
      className="create-session-modal"
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
            Create
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="px-4">
        <Form.Item
          name="name"
          label={<span>Session name</span>}
          rules={[
            { required: true, message: 'Please input session name' },
            { max: 100, message: 'Name must be less than 100 characters' }
          ]}
        >
          <Input placeholder="Enter session name" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="key"
          label={<span>Session key</span>}
          rules={[
            { required: true, message: 'Please input session key' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
          ]}
        >
          <Input placeholder="Enter session key" className="h-11 rounded-lg border-[#D1D5DB] bg-[#F9FAFB] px-3" />
        </Form.Item>

        <Form.Item
          name="testSetId"
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('startDate')
                  if (!value || !startDate) {
                    return Promise.resolve()
                  }
                  const startTime = startDate.valueOf()
                  const endTime = value.valueOf()
                  if (endTime <= startTime) {
                    return Promise.reject(new Error('End time must be after start time'))
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select end date"
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

CreateSessionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  testSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  )
}

export default CreateSessionModal
