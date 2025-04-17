import { approveSessionRequest, getPendingSessionRequests, rejectSessionRequest } from '@features/student/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function usePendingSessionRequests(sessionId) {
  return useQuery({
    queryKey: ['pendingSessionRequests', sessionId],
    queryFn: async () => {
      const response = await getPendingSessionRequests(sessionId)
      return response.data.map(item => ({
        key: item.ID,
        studentName: item.User.fullName,
        studentId: item.User.studentCode,
        className: item.User.class
      }))
    },
    refetchOnWindowFocus: true,
    refetchInterval: 2000
  })
}

export function useApproveSessionRequest(sessionId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestId => approveSessionRequest(sessionId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSessionRequests'] })
    }
  })
}

export function useRejectSessionRequest(sessionId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestId => rejectSessionRequest(sessionId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSessionRequests'] })
    }
  })
}
