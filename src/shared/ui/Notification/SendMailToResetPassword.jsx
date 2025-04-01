import { notification } from 'antd'
import { useEffect, useState } from 'react'

const SendMailToResetPassword = ({ user }) => {
  const [api, contextHolder] = notification.useNotification()
  const [timeLeft, setTimeLeft] = useState(900) // 900 giây = 15 phút

  useEffect(() => {
    const key = 'resetPasswordNotification'

    // Hàm cập nhật thông báo
    const updateNotification = remainingTime => {
      api.info({
        key,
        message: 'Password reset request',
        description: (
          <div className="text-gray-700">
            Dear <strong>{user.name}</strong>,
            <br />
            We received a request to reset your account password. If you did not request this, please ignore this email.
            <br />
            To reset your password, please click the link below:
            <br />
            <a href="/resetPassword" className="font-medium text-blue-500 hover:underline">
              Click here to reset your password
            </a>
            <br />
            <strong>Note:</strong> This link will expire in <strong>{formatTime(remainingTime)}</strong>. If you do not
            reset your password within this time, you will need to submit a new request.
            <br />
            <br />
            <strong>Instructions:</strong>
            <ul className="list-disc pl-5">
              <li>Click the link above.</li>
              <li>Enter and confirm your new password.</li>
              <li>Log in again using your new password.</li>
            </ul>
            <br />
            If you encounter any issues, please contact us for support.
            <br />
            <br />
            Best regards,
            <br />
            <strong>GreenPREP</strong>
          </div>
        ),
        placement: 'topRight',
        duration: 0, // Không tự động đóng
        className: 'bg-white shadow-lg border border-gray-200'
      })
    }

    // Cập nhật thông báo ngay khi render
    updateNotification(timeLeft)

    // Đếm ngược thời gian
    const countdown = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1
        if (newTime <= 0) {
          clearInterval(countdown)
          api.destroy(key) // Xóa thông báo sau 15 phút
        } else {
          updateNotification(newTime) // Cập nhật thông báo mỗi giây
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [api])

  // Hàm format thời gian sang phút:giây
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  return <>{contextHolder}</>
}

export default SendMailToResetPassword
