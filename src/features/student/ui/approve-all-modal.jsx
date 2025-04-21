import { CheckCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { useState } from 'react'

const ApproveAllConfirmModal = ({ isOpen, onClose, pendingData = [], onApproveSuccess, approveRequest }) => {
  const [loading, setLoading] = useState(false)

  const handleApproveAll = async () => {
    setLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      const keys = pendingData.map(item => item.key)
      for (const key of keys) {
        try {
          await approveRequest(key)
          successCount++
        } catch (error) {
          errorCount++
          console.error(`Failed to approve request ${key}:`, error)
        }
      }

      onApproveSuccess()
      if (errorCount === 0) {
        message.success(`Successfully approved all ${successCount} requests.`)
      } else {
        message.warning(`Approved ${successCount} requests, failed to approve ${errorCount} requests.`)
      }
      onClose()
    } catch {
      message.error('An unexpected error occurred during bulk approval')
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
        <CheckCircleOutlined className="mb-4 text-[50px] text-green-500" />
        <p className="mb-6 text-center text-lg">
          Are you sure you want to approve all {pendingData.length} pending requests?
        </p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={handleApproveAll}
            loading={loading}
            className="h-10 w-24 bg-green-500 text-white hover:bg-green-600"
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApproveAllConfirmModal
