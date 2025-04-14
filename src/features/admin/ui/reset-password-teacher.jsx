import { useResetPassword } from '@features/admin/hooks'
import { message, Modal } from 'antd'
import { useState } from 'react'

const ResetPasswordModal = ({ email, isVisible, onCancel, onResetSuccess }) => {
  const [loading, setLoading] = useState(false)
  const resetPasswordMutation = useResetPassword()

  const handleResetPassword = async () => {
    setLoading(true)

    try {
      await resetPasswordMutation.mutateAsync({ email })
      message.success('Password reset email sent successfully!')
      onResetSuccess()
    } catch {
      message.error('Failed to send password reset email')
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
      <p>This will send a password reset email to the user. Do you want to proceed?</p>
    </Modal>
  )
}

export default ResetPasswordModal
