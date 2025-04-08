import axiosInstance from '@shared/config/axios'
import { message } from 'antd'

export const fetchTeachers = async (params = {}) => {
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

export const createTeacher = async teacherData => {
  try {
    const { data } = await axiosInstance.post('/users/register', teacherData)
    return data
  } catch (error) {
    message.error('Error creating teacher')
    throw error
  }
}

export const fetchTeacherProfile = async userId => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}`)
    return data
  } catch (error) {
    message.error('Error fetching teacher profile')
    console.error('Error fetching teacher profile:', error)
    throw error
  }
}

export const updateTeacherProfile = async ({ userId, userData }) => {
  try {
    const { data } = await axiosInstance.put(`/users/${userId}`, userData)
    return data
  } catch (error) {
    message.error('Error updating teacher profile')
    throw error
  }
}

export const resetPassword = async ({ email }) => {
  try {
    const { data } = await axiosInstance.post('/users/forgot-password', { email })
    return data
  } catch (error) {
    message.error('Error sending reset password email')
    throw error
  }
}

export const fetchTeachersList = async payload => {
  try {
    const { data } = await axiosInstance.post('/users/teachers', payload)
    return data
  } catch (error) {
    console.error('Error fetching teachers list:', error)
    throw error
  }
}
