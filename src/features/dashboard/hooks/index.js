import { fetchClasses, fetchSessionParticipants, fetchSessions } from '@features/dashboard/api'
import { useQuery } from '@tanstack/react-query'

export const useSessionData = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })
}

export const useMyClasses = userId => {
  return useQuery({
    queryKey: ['classes', userId],
    queryFn: () => fetchClasses(userId)
  })
}
export const useSessionParticipants = sessionId => {
  return useQuery({
    queryKey: ['sessionParticipants', sessionId],
    queryFn: () => fetchSessionParticipants(sessionId)
  })
}
