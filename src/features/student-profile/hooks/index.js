import { useQuery } from '@tanstack/react-query'
import { fetchStudentProfile, fetchStudentSessionHistory } from '../api'

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
