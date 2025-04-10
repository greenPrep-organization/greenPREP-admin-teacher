import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@shared/config/axios'

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

export const useGetWritingData = () => {
  const SessionId = '26fc28e3-a9d8-45f5-ac7b-88086075e82e'
  const topicId = 'ef6b69aa-2ec2-4c65-bf48-294fd12e13fc'
  const StudentId = '7a5cb071-5ba0-4ecf-a4cf-b1b62e5f9798'
  const SkillName = 'writing'

  return useQuery({
    queryKey: ['writingData', SessionId, StudentId, SkillName, topicId],
    queryFn: async () => {
      const url = `/grades/participants?sessionId=${SessionId}&studentId=${StudentId}&skillName=${SkillName}&topicId=${topicId}`
      const response = await axiosInstance.get(url)
      return response.data
    },
    enabled: !!SessionId && !!StudentId && !!SkillName && !!topicId
  })
}
