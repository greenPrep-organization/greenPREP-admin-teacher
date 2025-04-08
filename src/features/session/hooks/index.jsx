import { getSessionsByClassId, createSession } from '@features/session/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

/**
 * @typedef {Object} SessionInput
 * @property {string} name
 * @property {string} key
 * @property {string} testSetId
 * @property {Date} startTime
 * @property {Date} endTime
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} name
 * @property {string} key
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {string} status
 */

/**
 * @typedef {Object} APIError
 * @property {string} message
 * @property {Object} [response]
 * @property {Object} [response.data]
 * @property {string} [response.data.message]
 */

export function useSessions(classId) {
  return useQuery({
    queryKey: ['sessions', classId],
    queryFn: async () => {
      const response = await getSessionsByClassId(classId)
      return response.data
    },
    enabled: Boolean(classId)
  })
}

/**
 * Hook to create a new session
 * @param {string} classId
 * @returns {import('@tanstack/react-query').UseMutationResult<any, Error, SessionInput>}
 */
export function useCreateSession(classId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async data => {
      // Validate required fields
      if (!data.name || !data.key || !data.testSetId || !data.startTime || !data.endTime) {
        throw new Error('Missing required fields')
      }

      // Format dates
      const formattedData = {
        name: data.name,
        key: data.key,
        testSetId: data.testSetId,
        startTime: dayjs(data.startTime).format('YYYY-MM-DDTHH:mm:ss'),
        endTime: dayjs(data.endTime).format('YYYY-MM-DDTHH:mm:ss'),
        ClassID: classId
      }

      console.log('🔄 Processing session data:', {
        original: data,
        formatted: formattedData
      })

      const result = await createSession(formattedData)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', classId] })
    },
    onError: error => {
      console.error('❌ Session creation failed:', error.message)
      // Safe access to response data if it exists
      const serverMessage = error?.response?.data?.message
      if (serverMessage) {
        console.error('Server error:', serverMessage)
      }
    }
  })
}
