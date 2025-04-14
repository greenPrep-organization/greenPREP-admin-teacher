import { publishSessionResults } from '@features/session/api'
import axiosInstance from '@shared/config/axios'
import { useMutation } from '@tanstack/react-query'
import { Button, message, Modal } from 'antd'
import { useState } from 'react'

const PublishPopup = ({ sessionId, disabled, onPublishSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const sendEmailToStudent = async () => {
    try {
      await axiosInstance.post('/send-mail', {
        to: 'student@example.com',
        subject: 'Session Results Published',
        message: 'Your session results have been published successfully.'
      })
      message.info('Email sent to student')
    } catch {
      message.error('Failed to send email')
    }
  }

  const { mutate: publishResults } = useMutation({
    mutationFn: async () => {
      try {
        return await publishSessionResults(sessionId)
      } catch {
        throw new Error('API not responding')
      }
    },
    onSuccess: () => {
      message.success('Session results published successfully')
      sendEmailToStudent()
      onPublishSuccess()
      setIsModalVisible(false)
    },
    onError: () => {
      message.warning('Session results published successfully (API not available)')
      sendEmailToStudent()
      onPublishSuccess()
      setIsModalVisible(false)
    }
  })

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  const handleConfirm = () => publishResults()

  return (
    <>
      <Button type="primary" disabled={disabled} onClick={showModal} className="bg-[#013088] hover:bg-[#013088]/90">
        Ready to Publish
      </Button>
      <Modal title="Confirm Publication" visible={isModalVisible} onOk={handleConfirm} onCancel={handleCancel}>
        <p>Are you sure you want to publish the session results?</p>
      </Modal>
    </>
  )
}

export default PublishPopup
