import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPendingSessionRequests, approveSessionRequest, rejectSessionRequest } from '@features/student/api'

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
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
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
