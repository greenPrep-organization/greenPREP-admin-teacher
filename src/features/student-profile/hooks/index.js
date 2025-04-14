import { useQuery } from '@tanstack/react-query'
import { fetchSessionDetail, fetchStudentProfile, fetchStudentSessionHistory } from '../api'

export const useStudentProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchStudentProfile(userId),
    enabled: !!userId
  })
}

export const useStudentSessionHistory = userId => {
  return useQuery({
    queryKey: ['studentSessionHistory', userId],
    queryFn: () => fetchStudentSessionHistory(userId),
    enabled: !!userId
  })
}

export const useSessionDetail = sessionId => {
  return useQuery({
    queryKey: ['session-detail', sessionId],
    queryFn: () => fetchSessionDetail(sessionId),
    enabled: !!sessionId
  })
}
