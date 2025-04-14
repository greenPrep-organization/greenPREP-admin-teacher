import { Warning } from '@assets/images'
import { useDeleteSession } from '@features/session/hooks'
import { Button, Modal, message } from 'antd'
import { useState } from 'react'

const DeleteSessionPopup = ({ isOpen, onClose, sessionId }) => {
  const [loading, setLoading] = useState(false)
  const deleteSession = useDeleteSession()

  const confirmDelete = async () => {
    setLoading(true)
    try {
      await deleteSession.mutateAsync(sessionId)
      message.success('Session deleted successfully')
      onClose()
    } catch (error) {
      message.error(error.message || 'Failed to delete session')
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
        <img src={Warning} alt="" className="mb-4 h-12 w-12 text-yellow-500" />
        <p className="mb-6 text-center text-lg">Are you sure you want to delete this session?</p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
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

export default DeleteSessionPopup
