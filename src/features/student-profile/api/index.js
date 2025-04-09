import axiosInstance from '@shared/config/axios'
import { message } from 'antd'

export const fetchStudentProfile = async userId => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}`)
    return data
  } catch (error) {
    message.error('Error fetching student profile')
    console.error('Error fetching student profile:', error)
    throw error
  }
}

export const fetchStudentSessionHistory = async userId => {
  try {
    const { data } = await axiosInstance.get(`/session-participants/user/${userId}`)
    return data
  } catch (error) {
    message.error('Error fetching session history')
    console.error('Error fetching session history:', error)
    throw error
  }
}
