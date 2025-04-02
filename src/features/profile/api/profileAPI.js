import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'

const accessToken = localStorage.getItem('access_token')

const fetchUserProfile = async userId => {
  try {
    console.log(`Fetching user profile for userId: ${userId}`)
    const { data } = await axiosInstance.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

const updateUserProfile = async ({ userId, userData }) => {
  try {
    const { data } = await axiosInstance.put(`/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

const changeUserPassword = async ({ userId, passwordData }) => {
  try {
    const { data } = await axiosInstance.post(`/users/${userId}/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
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
    enabled: !!userId && !!accessToken
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
