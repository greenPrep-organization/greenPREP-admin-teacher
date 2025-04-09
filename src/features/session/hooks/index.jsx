import { getSessionsByClassId, createSession } from '@features/session/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSessions(classId) {
  return useQuery({
    queryKey: ['sessions', classId],
    queryFn: async () => {
      const response = await getSessionsByClassId(classId)
      return response.data.data.map(item => ({
        id: item.ID,
        name: item.sessionName,
        key: item.sessionKey,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        participants: 0,
        status: item.status
      }))
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  })
}

export const useCreateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: error => {
      throw error
    }
  })
}
