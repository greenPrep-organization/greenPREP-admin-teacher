import axiosInstance from '@shared/config/axios'
import { useMutation, useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

const fetchUserProfile = async userId => {
  try {
    console.log(`Fetching user profile for userId: ${userId}`)
    const { data } = await axiosInstance.get(`${API_BASE_URL}/users/${userId}`)
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

const updateUserProfile = async ({ userId, userData }) => {
  try {
    const { data } = await axiosInstance.put(`${API_BASE_URL}/users/${userId}`, userData)
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

const changeUserPassword = async ({ userId, passwordData }) => {
  try {
    const { data } = await axiosInstance.post(`${API_BASE_URL}/users/${userId}/change-password`, passwordData)
    return data
  } catch (error) {
    console.error('Error changing password:', error)
    throw error
  }
}

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => await fetchUserProfile(userId),
    enabled: !!userId
  })
}

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile
  })
}

export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: changeUserPassword
  })
}
