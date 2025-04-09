import axios from 'axios'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'
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
const forgotPasswordAPI = payload => {
  return axiosInstance.post('/users/forgot-password', payload)
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
    mutationFn: async params => {
      const { data } = await forgotPasswordAPI(params)
      return data.data
    }
    // onSuccess() {
    //   message.success("Please check your email to reset your password");
    // },
    // onError({ response }) {
    //   message.error(response.data.message);
    // },
  })
}
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordAPI
  })
}
