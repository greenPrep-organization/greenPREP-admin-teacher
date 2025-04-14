import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { deleteClass } from '@features/class-management/api'

export const useDeleteClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      message.success('Class deleted successfully')
      // @ts-ignore
      queryClient.invalidateQueries(['classes'])
    },
    onError: () => {
      message.error('Failed to delete class')
    }
  })
}
