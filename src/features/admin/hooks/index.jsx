import { fetchTeachersList, updateTeacherProfile } from '@features/admin/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTeachers = ({ page = 1, limit = 10, search = '', status = undefined }) => {
  return useQuery({
    queryKey: ['teachers', { page, limit, search, status }],
    queryFn: () => fetchTeachersList({ page, limit, search, status })
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
