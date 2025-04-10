import axiosInstance from '@shared/config/axios'
import { message } from 'antd'

export const fetchSessions = async () => {
  const response = await axiosInstance.get(`/sessions/all`)
  return response.data
}
export const fetchUser = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = params
    const { data } = await axiosInstance.post('/users/teachers', {
      params: {
        page,
        limit,
        search
      }
    })
    return data
  } catch (error) {
    message.error('Error fetching teachers')
    throw error
  }
}
