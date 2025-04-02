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
