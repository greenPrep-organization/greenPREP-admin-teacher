import { Button, Modal } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

const RejectSessionPopup = ({ isOpen, onClose, onReject, studentName, loading }) => {
  const handleReject = async () => {
    try {
      await onReject()
    } finally {
      onClose()
    }
  }

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} closable={false} centered width={400}>
      <div className="flex flex-col items-center">
        <CloseCircleOutlined className="mb-4 text-4xl text-red-500" />
        <p className="mb-6 text-center text-lg">
          Are you sure you want to reject {studentName}&apos;s session request?
        </p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={handleReject} loading={loading} className="h-10 w-24 bg-red-500 text-white hover:bg-red-600">
            Reject
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectSessionPopup
