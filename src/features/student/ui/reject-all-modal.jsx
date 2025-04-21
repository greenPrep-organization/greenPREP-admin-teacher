import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { useState } from 'react'

const RejectAllConfirmModal = ({ isOpen, onClose, pendingData = [], onRejectSuccess, rejectRequest }) => {
  const [loading, setLoading] = useState(false)
  const [progress] = useState(0)

  const handleRejectAll = async () => {
    setLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      const keys = pendingData.map(item => item.key)
      for (const key of keys) {
        try {
          await rejectRequest(key)
          successCount++
        } catch (error) {
          errorCount++
          console.error(`Failed to reject request ${key}:`, error)
        }
      }

      onRejectSuccess()
      if (errorCount === 0) {
        message.success(`Successfully rejected all ${successCount} requests.`)
      } else {
        message.warning(`Rejected ${successCount} requests, failed to reject ${errorCount} requests.`)
      }
      onClose()
    } catch {
      message.error('An unexpected error occurred during bulk rejection')
    } finally {
      setLoading(false)
    }
  }

  {
    loading && (
      <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
        <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progress}%` }}></div>
      </div>
    )
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
        <CloseCircleOutlined className="mb-4 text-[50px] text-red-500" />
        <p className="mb-6 text-center text-lg">
          Are you sure you want to reject all {pendingData.length} pending requests?
        </p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:!bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={handleRejectAll}
            loading={loading}
            className="transition- h-10 w-24 bg-red-500 text-white hover:!bg-red-600"
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectAllConfirmModal
