import axios from 'axios'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'
import { useMutation } from '@tanstack/react-query'

const API_BASE_URL = 'https://dev-api-greenprep.onrender.com/api'

// Hàm gọi API cơ bản
const loginAPI = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, {
    email,
    password
  })

  if (response.data?.data?.access_token) {
    localStorage.setItem(ACCESS_TOKEN, response.data.data.access_token)
  }

  return response.data
}

const forgotPasswordAPI = async email => {
  const response = await axios.post(
    `${API_BASE_URL}/users/forgot-password`,
    { email },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  )
  return response.data
}

const resetPasswordAPI = async ({ token, newPassword }) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/reset-password`,
    {
      token,
      newPassword
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  )
  return response.data
}

// Custom hooks sử dụng React Query
export const useLogin = () => {
  return useMutation({
    mutationFn: loginAPI
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordAPI
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordAPI
  })
}
