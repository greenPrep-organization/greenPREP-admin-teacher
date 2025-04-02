import { useQuery } from '@tanstack/react-query'
import { getPendingSessionRequests } from '@features/student/api'

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
