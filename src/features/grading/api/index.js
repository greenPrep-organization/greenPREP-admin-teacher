import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'

export const useGetSpeakingTest = (sessionParticipantId, skillName = 'speaking') => {
  return useQuery({
    queryKey: ['speakingTest', sessionParticipantId],
    queryFn: async () => {
      const response = await axiosInstance.get('/grades/participants', {
        params: {
          sessionParticipantId,
          skillName
        }
      })
      return response.data
    },
    enabled: !!sessionParticipantId
  })
}

export const useGetSessionParticipants = (sessionId, params = { page: 1, limit: 5, search: '' }) => {
  return useQuery({
    queryKey: ['sessionParticipants', sessionId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(`/session-participants/${sessionId}`, {
        params
      })
      return response.data
    },
    enabled: !!sessionId
  })
}

export const useGetWritingData = (sessionParticipantId, skillName = 'writing') => {
  return useQuery({
    queryKey: ['writingData', sessionParticipantId, skillName],
    queryFn: async () => {
      const response = await axiosInstance.get('/grades/participants', {
        params: {
          sessionParticipantId,
          skillName
        }
      })
      return response.data
    },
    enabled: !!sessionParticipantId && !!skillName
  })
}
