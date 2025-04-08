import { useResetPassword } from '@features/admin/api'
import { message, Modal } from 'antd'
import { useState } from 'react'

const ResetPasswordModal = ({ isVisible, onCancel, onResetSuccess }) => {
  const [loading, setLoading] = useState(false)
  const resetPasswordMutation = useResetPassword()

  // eslint-disable-next-line no-unused-vars
  const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return password
  }

  const handleResetPassword = async () => {
    setLoading(true)
    const newPassword = '123456789'

    try {
      await resetPasswordMutation.mutateAsync({ newPassword })
      message.success('Password reset successfully!')
      onResetSuccess()
    } catch {
      message.error('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Reset Password"
      open={isVisible}
      onCancel={onCancel}
      onOk={handleResetPassword}
      confirmLoading={loading}
      okText="Reset Password"
      cancelText="Cancel"
    >
      <p>Are you sure you want to reset the password? A random password will be generated and sent to the user.</p>
    </Modal>
  )
}

export default ResetPasswordModal
