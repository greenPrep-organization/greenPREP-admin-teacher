import { useState } from 'react'
import SendMailToResetPassword from '@shared/ui/Notification/SendMailToResetPassword'

const TextPage = () => {
  const [showNotification, setShowNotification] = useState(false)

  const handleClick = () => {
    setShowNotification(true)
  }

  return (
    <div>
      <button onClick={handleClick}>Send Mail to Reset Password</button>
      {showNotification && <SendMailToResetPassword user={{ name: 'John Doe', email: 'john.doe@example.com' }} />}
    </div>
  )
}

export default TextPage
