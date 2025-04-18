import { Warning } from '@assets/images'
import { Button, message, Modal } from 'antd'
import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
const rejectRequest = async key => {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

const RejectAllConfirmModal = ({ isOpen, onClose, pendingData = [], onRejectSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleRejectAll = async () => {
    setLoading(true)
    try {
      const keys = pendingData.map(item => item.key)
      for (const key of keys) {
        await rejectRequest(key)
      }
      onRejectSuccess()
      message.success('All pending requests have been rejected.')
      onClose()
    } catch {
      message.error('Failed to reject all requests')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={400}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex flex-col items-center">
        <img src={Warning} alt="Warning" className="mb-4 h-12 w-12 text-yellow-500" />
        <p className="mb-6 text-center text-lg">
          Are you sure you want to reject all {pendingData.length} pending requests?
        </p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={handleRejectAll}
            loading={loading}
            className="h-10 w-24 bg-red-500 text-white hover:bg-red-600"
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectAllConfirmModal
