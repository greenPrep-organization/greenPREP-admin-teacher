import { fetchSessions } from '@features/dashboard/api'
import { useQuery } from '@tanstack/react-query'

export const useSessionData = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })
}
