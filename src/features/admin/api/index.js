import axiosInstance from '@shared/config/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const createTeacher = async teacherData => {
  try {
    const { data } = await axiosInstance.post('/users/register', teacherData)
    return data
  } catch (error) {
    console.error('Error creating teacher:', error)
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
    console.log(data)
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

const resetPassword = async ({ email }) => {
  try {
    const { data } = await axiosInstance.post('/users/forgot-password', {
      email
    })
    return data
  } catch (error) {
    console.error('Error sending forgot password email:', error)
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

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: error => {
      console.error('Error creating teacher:', error)
    }
  })
}

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTeacherProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: error => {
      console.error('Error updating profile:', error)
    }
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword
  })
}
