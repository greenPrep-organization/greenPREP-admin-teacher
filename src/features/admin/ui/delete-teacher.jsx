import { Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

const DeleteTeacherModal = ({ isOpen, onClose, onConfirm }) => {
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

        <h3 className="mb-2 text-center text-[16px] font-medium leading-6 text-[#111827]">
          Are you sure you want to <br /> Delete Account?
        </h3>

        <p className="mb-4 text-center text-[12px] leading-4 text-[#6B7280]">
          After you delete this account, this account will no longer available in this list.
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[7px] border border-[#E5E7EB] bg-white py-2 text-[14px] font-normal text-[#374151] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ border: 'none', outline: 'none' }}
            className="flex-1 rounded-[7px] bg-[#F87171] py-2 text-[14px] font-normal text-white transition-colors hover:bg-[#F87171]/90 focus:outline-none focus:ring-0"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteTeacherModal
