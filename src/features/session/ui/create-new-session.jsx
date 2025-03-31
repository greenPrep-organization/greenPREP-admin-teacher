// features/sessions/components/CreateSessionModal.jsx
import { Modal, Form, Input, Select, DatePicker, notification } from 'antd'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

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
      title="Create new session"
      open={visible}
      onCancel={onCancel}
      width={400}
      destroyOnClose
      className="custom-modal"
      footer={[
        <div key="footer" className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-1 text-gray-700 hover:border-gray-400 hover:text-gray-800"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="rounded bg-[#003366] px-4 py-1 text-white hover:bg-[#002347]">
            Create
          </button>
        </div>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={<span className="text-gray-800">Session name:</span>}
          rules={[
            { required: true, message: 'Please input session name' },
            { max: 100, message: 'Name must be less than 100 characters' }
          ]}
        >
          <Input placeholder="Enter session name" className="rounded" />
        </Form.Item>

        <Form.Item
          name="key"
          label={<span className="text-gray-800">Session key:</span>}
          rules={[
            { required: true, message: 'Please input session key' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens allowed' }
          ]}
        >
          <Input placeholder="Enter session key" className="rounded" />
        </Form.Item>

        <Form.Item
          name="testSetId"
          label={<span className="text-gray-800">Select test set:</span>}
          rules={[{ required: true, message: 'Please select a test set' }]}
        >
          <Select placeholder="Choose the test set" className="rounded">
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
            label={<span className="text-gray-800">Start date:</span>}
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full rounded"
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label={<span className="text-gray-800">End date:</span>}
            rules={[
              { required: true, message: 'Please select end date' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('End date must be after start date'))
                }
              })
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full rounded"
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
