import { Modal, Typography } from 'antd'
import ClassForm from '@features/class-management/hooks/create-edit-form'

const { Title } = Typography

const CreateClassModal = ({ visible, onClose, onSuccess }) => (
  <Modal
    visible={visible}
    title={
      <Title level={2} style={{ textAlign: 'center' }}>
        Create a new class
      </Title>
    }
    onCancel={onClose}
    footer={null}
    centered
  >
    <ClassForm onSuccess={onSuccess} isEditMode={false} initialData={''} onClose={onClose} />
  </Modal>
)

const EditClassModal = ({ visible, onClose, onSuccess, initialData }) => (
  <Modal
    visible={visible}
    title={
      <Title level={2} style={{ textAlign: 'center' }}>
        Edit class
      </Title>
    }
    onCancel={onClose}
    footer={null}
    centered
  >
    <ClassForm onSuccess={onSuccess} isEditMode={true} initialData={initialData} onClose={onClose} />
  </Modal>
)

export { CreateClassModal, EditClassModal }
