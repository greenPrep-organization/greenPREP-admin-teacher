import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'

const SESSION_PARTICIPANT_ID = '45c6d73a-ad6f-4eb7-b5ba-9adcb97c91f0'

export const useGetSpeakingTest = (topicId, skillName = 'SPEAKING') => {
  return useQuery({
    queryKey: ['speakingTest', topicId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/topics/${topicId}`, {
        params: { skillName }
      })

      const sortedData = {
        ...response.data,
        Parts: [...response.data.Parts].sort((a, b) => {
          const partNumberA = parseInt(a.Content.split(' ')[1])
          const partNumberB = parseInt(b.Content.split(' ')[1])
          return partNumberA - partNumberB
        })
      }

      return sortedData
    },
    enabled: !!topicId
  })
}

export const useGetWritingData = (sessionParticipantId = SESSION_PARTICIPANT_ID, skillName = 'writing') => {
  return useQuery({
    queryKey: ['writingData', sessionParticipantId, skillName],
    queryFn: async () => {
      const url = `/grades/participants?sessionParticipantId=${sessionParticipantId}&skillName=${skillName}`
      const response = await axiosInstance.get(url)
      return response.data
    },
    enabled: !!sessionParticipantId && !!skillName
  })
}
