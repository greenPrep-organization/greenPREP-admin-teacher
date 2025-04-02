import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = import.meta.env.VITE_BASE_URL

export const useGetSpeakingTest = (topicId, skillName = 'SPEAKING') => {
  return useQuery({
    queryKey: ['speakingTest', topicId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/topics/${topicId}`, {
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
