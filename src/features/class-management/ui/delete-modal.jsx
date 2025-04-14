import { Modal, Button } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { useDeleteClass } from '@features/class-management/hooks/delete-class'

const DeleteConfirmModal = ({ visible, classId, onClose, onSuccess }) => {
  const deleteClassMutation = useDeleteClass()

  const handleConfirmDelete = () => {
    if (classId) {
      deleteClassMutation.mutate(classId, {
        onSuccess: () => {
          onSuccess()
          onClose()
        }
      })
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      style={{ maxWidth: '90vw' }}
      closable={false}
      centered
      className="!rounded-xl !p-6 !text-center"
    >
      <div className="flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <WarningOutlined className="rounded-full text-xl text-red-600" />
        </div>
        <h3 className="mb-8 text-lg font-semibold text-gray-800">Are you sure you want to delete class?</h3>
        <div className="mt-3 flex justify-center gap-4">
          <Button
            style={{
              width: '8rem',
              borderRadius: '6px',
              fontWeight: '500',
              padding: '16px 0',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#6B7280'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'
              e.currentTarget.style.color = 'black'
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              width: '8rem',
              borderRadius: '6px',
              backgroundColor: '#F18181',
              color: 'white',
              fontWeight: '500',
              padding: '16px 0',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e65050')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F18181')}
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
