import { Warning } from '@assets/Images/index'
import { Button, Modal } from 'antd'
import { useState } from 'react'

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={400}
      bodyStyle={{ padding: '24px' }}
      okButtonProps={{ danger: true, disabled: loading }}
    >
      <div className="flex flex-col items-center">
        <img src={Warning} alt="" className="mb-4 h-12 w-12 text-yellow-500" />
        <p className="mb-6 text-center text-lg">Are you sure you want to delete this session?</p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={loading} className="h-10 w-24 bg-red-500 text-white hover:bg-red-600">
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const DeleteSessionPopup = ({ isOpen, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false)

  const confirmDelete = async () => {
    setLoading(true)
    try {
      await onDelete()
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return <DeleteModal isOpen={isOpen} onClose={onClose} onConfirm={confirmDelete} loading={loading} />
}

export default DeleteSessionPopup
