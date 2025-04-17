import { publishSessionResults } from '@features/session/api'
import { useMutation } from '@tanstack/react-query'
import { Button, message, Modal } from 'antd'
import { useState } from 'react'

const PublishPopup = ({ sessionId, disabled, onPublishSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { mutate: publishResults, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error('Session ID not found')
      }
      return await publishSessionResults(sessionId)
    },
    onSuccess: () => {
      message.success('Session results published successfully')
      onPublishSuccess()
      setIsModalVisible(false)
    },
    onError: error => {
      console.error('Publish error:', error)
      if (error.message.includes('Server error:')) {
        message.error('Server error occurred. Please try again later.')
      } else if (error.message === 'Session ID not found') {
        message.error('Session ID is required')
      } else {
        message.error(error.message || 'Failed to publish session results')
      }
      setIsModalVisible(false)
    }
  })

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  const handleConfirm = () => publishResults()

  return (
    <>
      <Button type="primary" disabled={disabled} onClick={showModal} className="bg-[#013088]" loading={isLoading}>
        Ready to Publish
      </Button>
      <Modal
        title="Confirm Publication"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <p>Are you sure you want to publish the session results?</p>
      </Modal>
    </>
  )
}

export default PublishPopup
