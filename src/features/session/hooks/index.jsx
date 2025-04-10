import { createSession, getSessionsByClassId } from '@features/session/api'
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

export function useCreateSession(classId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async data => {
      return await createSession(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sessions', classId]
      })
    }
  })
}
