import { Button, Modal } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const ApproveSessionPopup = ({ isOpen, onClose, onApprove, studentName, loading }) => {
  const handleApprove = async () => {
    try {
      await onApprove()
    } finally {
      onClose()
    }
  }

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} closable={false} centered width={400}>
      <div className="flex flex-col items-center">
        <CheckCircleOutlined className="mb-4 text-4xl text-yellow-500" />
        <p className="mb-6 text-center text-lg">
          Are you sure you want to approve {studentName}&apos;s session request?
        </p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            loading={loading}
            className="h-10 w-24 bg-green-500 text-white hover:bg-green-600"
          >
            Approve
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApproveSessionPopup
