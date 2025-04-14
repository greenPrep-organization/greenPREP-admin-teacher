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

export const fetchClasses = async userId => {
  try {
    const { data } = await axiosInstance.get('/classes')
    const classList = data?.data || []
    const myClasses = classList.filter(cls => {
      return cls.UserID?.trim() === String(userId).trim()
    })
    return myClasses
  } catch (error) {
    message.error('Error when fetch class by Teacher created', error)
    return []
  }
}

export const fetchSessionParticipants = async (sessionId, page = 1, limit = 100) => {
  try {
    const { data } = await axiosInstance.get(`/session-participants/${sessionId}`, {
      params: { page, limit }
    })
    return data?.data || []
  } catch (error) {
    message.error('Error fetching session participants', error)
    return []
  }
}
