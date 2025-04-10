import {
  createTeacher,
  fetchTeacherProfile,
  fetchTeachers,
  resetPassword,
  updateTeacherProfile,
  deleteTeacher
} from '@features/admin/api'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    retry: 1
  })
}

export const useTeacherProfile = userId => {
  return useQuery({
    queryKey: ['teacherProfile', userId],
    queryFn: () => fetchTeacherProfile(userId),
    enabled: !!userId
  })
}

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    }
  })
}

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTeacherProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    }
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword
  })
}

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: error => {
      console.error('Error deleting teacher:', error)
    }
  })
}
