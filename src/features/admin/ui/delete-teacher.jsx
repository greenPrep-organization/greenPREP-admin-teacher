import { Modal, Typography, Button, Space, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

const { Text, Title } = Typography

const DeleteTeacherModal = ({ isOpen, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm()
    message.success('Account deleted successfully')
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={352}
      closable={false}
      centered
      className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[14px] [&_.ant-modal-content]:p-0"
    >
      <div className="flex flex-col items-center px-6 pb-6 pt-7">
        <div className="mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#FEE2E2]">
          <ExclamationCircleFilled className="text-[24px] text-[#EF4444]" />
        </div>

        <Title level={4} className="!m-0 !mb-2 !text-center !text-[16px] !font-medium !text-[#111827]">
          Are you sure you want to <br /> Delete Account?
        </Title>

        <Text className="mb-4 block text-center text-[12px] leading-4 text-[#6B7280]">
          After you delete this account, this account will no longer available in this list.
        </Text>

        <Space size={12} className="flex w-[320px] justify-center">
          <Button
            onClick={onClose}
            className="!h-[35px] !w-[155px] !rounded-[8px] !border-[#E5E7EB] !bg-white !px-0 !text-[14px] !font-normal !text-[#374151] hover:!bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            danger
            className="!h-[35px] !w-[155px] !rounded-[8px] !border-none !bg-[#F87171] !px-0 !text-[14px] !font-normal hover:!bg-[#F87171]/90"
          >
            Yes
          </Button>
        </Space>
      </div>
    </Modal>
  )
}

export default DeleteTeacherModal
