import axios from 'axios'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'
import { useMutation } from '@tanstack/react-query'

const API_BASE_URL = 'https://dev-api-greenprep.onrender.com/api'

// Logout API function
const logoutAPI = async userId => {
  const token = localStorage.getItem(ACCESS_TOKEN)

  if (!userId || !token) {
    throw new Error('User ID or token not found')
  }

  const response = await axios.post(
    `${API_BASE_URL}/users/logout/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  )

  return response.data
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutAPI
  })
}
