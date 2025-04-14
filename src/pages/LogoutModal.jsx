import { Modal, Button, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '@app/providers/reducer/auth/authSlice'
import { useLogout } from '@features/auth/api'
import { useState } from 'react'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'
import { jwtDecode } from 'jwt-decode'

const { Title, Text } = Typography

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutError, setLogoutError] = useState(null)
  const [logoutSuccess, setLogoutSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getUserData = () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN)
      return token ? jwtDecode(token) : null
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  const { mutate: logoutUser } = useLogout()

  const performLocalLogout = successMessage => {
    dispatch(logout())
    localStorage.removeItem('userId')
    localStorage.removeItem(ACCESS_TOKEN)
    sessionStorage.removeItem(ACCESS_TOKEN)

    if (successMessage) {
      setLogoutSuccess(successMessage)
      message.success(successMessage)
    }

    onClose()
    navigate('/login')
  }

  const handleLogout = async () => {
    setIsLoading(true)
    setLogoutError('')
    setLogoutSuccess('')

    try {
      const userData = getUserData()
      const userId = userData
        ? userData['_id'] || userData['id'] || userData['sub'] || null
        : localStorage.getItem('userId')

      if (userId) {
        await logoutUser(userId)

        performLocalLogout('Logout successful!')
      } else {
        performLocalLogout('Logout successful!')
      }
    } catch (error) {
      console.error('Logout error:', error)
      setLogoutError('Failed to logout from server')

      message.warning('Logged out locally. Server logout failed.')
      performLocalLogout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={null}
      centered
      width={350}
      maskClosable={false}
      closable={false}
      className="rounded-lg"
      bodyStyle={{
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <Title
        level={4}
        className="!m-0 text-center"
        style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#000000',
          marginBottom: '4px'
        }}
      >
        Do you want to log out?
      </Title>

      <Text
        className="text-center"
        style={{
          fontSize: '13px',
          color: 'rgba(0, 0, 0, 0.65)',
          maxWidth: '252px',
          marginBottom: '8px',
          lineHeight: '1.6'
        }}
      >
        Are you sure you want to log out? You will need to log in again to access your account.
      </Text>

      {logoutError && <Text className="mb-4 text-red-500">{logoutError}</Text>}

      {logoutSuccess && <Text className="mb-4 text-green-500">{logoutSuccess}</Text>}

      <div className="flex w-full justify-center gap-2" style={{ marginTop: '4px' }}>
        <Button
          onClick={onClose}
          style={{
            width: '144px',
            height: '34px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: '13px',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)'
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          onClick={handleLogout}
          style={{
            width: '144px',
            height: '34px',
            borderRadius: '4px',
            backgroundColor: '#ff4d4f',
            color: '#ffffff',
            fontSize: '13px',
            border: 'none',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)'
          }}
          className="hover:!bg-[#ff7875]"
          loading={isLoading}
        >
          Log out
        </Button>
      </div>
    </Modal>
  )
}

export default LogoutModal
