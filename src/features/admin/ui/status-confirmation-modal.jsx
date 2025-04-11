import { WarningOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'

const StatusConfirmationModal = ({ isVisible, onCancel, onConfirm, teacherName, currentStatus }) => {
  const isDeactivating = currentStatus === 'Active' || currentStatus === true

  return (
    <Modal
      open={isVisible}
      footer={null}
      onCancel={onCancel}
      width={450}
      centered
      closable={false}
      className="status-confirmation-modal"
      styles={{
        body: {
          padding: 0 // Tailwind handles padding, so set to 0 here
        }
      }}
    >
      <div className="flex flex-col items-center p-4 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <WarningOutlined className="text-2xl text-red-500" />
        </div>

        <h3 className="mb-2 text-lg font-medium">
          This account is currently {isDeactivating ? 'active' : 'inactive'}. Would you like to{' '}
          {isDeactivating ? 'deactivate' : 'activate'} it?
        </h3>

        <p className="mb-6 text-gray-600">
          {isDeactivating
            ? `Once deactivated, this account ${teacherName} will no longer be able to log in to the system.`
            : `Once activated, this account ${teacherName} will  be able to log in to the system.`}
        </p>

        <div className="flex w-full gap-4">
          <Button onClick={onCancel} className="h-10 flex-1">
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className={`h-10 flex-1 border-none ${
              isDeactivating ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default StatusConfirmationModal
