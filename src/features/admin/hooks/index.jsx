import {
  createTeacher,
  deleteTeacher,
  fetchTeacherProfile,
  fetchTeachersList,
  resetPassword,
  updateTeacherProfile
} from '@features/admin/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTeachers = ({ page = 1, limit = 10, search = '', status = undefined }) => {
  return useQuery({
    queryKey: ['teachers', { page, limit, search, status }],
    queryFn: () => fetchTeachersList({ page, limit, search, status })
  })
}

export const useTeacherProfile = userId => {
  return useQuery({
    queryKey: ['teacherProfile', userId],
    queryFn: () => fetchTeacherProfile(userId),
    enabled: !!userId
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
export const useCreateTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacher,
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
