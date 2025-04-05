import axiosInstance from '@shared/config/axios'
import { useMutation, useQuery } from '@tanstack/react-query'

const fetchTeachers = async (params = {}) => {
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
    console.error('Error fetching teachers:', error)
    throw error
  }
}

const fetchTeacherProfile = async userId => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}`)
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

const updateTeacherProfile = async ({ userId, userData }) => {
  try {
    const { data } = await axiosInstance.put(`/users/${userId}`, userData)
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// New function for reset password
const resetPassword = async ({ token, newPassword }) => {
  try {
    const { data } = await axiosInstance.post('/users/reset-password', {
      token,
      newPassword
    })
    return data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

export const useTeacherProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => await fetchTeacherProfile(userId),
    enabled: !!userId
  })
}

export const useUpdateTeacherProfile = () => {
  return useMutation({
    mutationFn: updateTeacherProfile
  })
}

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    retry: 1
  })
}

// New mutation hook for reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword
  })
}
