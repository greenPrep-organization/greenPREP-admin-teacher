import { getSessionsByClassId, createSession } from '@features/session/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * @typedef {Object} SessionData
 * @property {string} sessionName
 * @property {string} sessionKey
 * @property {string} examSet
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} ClassID
 * @property {string} [status]
 */

export function useSessions(classId) {
  return useQuery({
    queryKey: ['sessions', classId],
    queryFn: async () => {
      const response = await getSessionsByClassId(classId)
      return response.data.data.map(item => ({
        id: item.ID,
        name: item.sessionName,
        key: item.sessionKey,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        participants: 0,
        status: item.status
      }))
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (/** @type {SessionData} */ sessionData) => {
      if (!sessionData || typeof sessionData !== 'object') {
        throw new Error('Invalid session data')
      }

      if (!sessionData.ClassID) {
        throw new Error('ClassID is required')
      }

      if (!sessionData.startTime || !sessionData.endTime) {
        throw new Error('Start time and end time are required')
      }

      const formattedData = {
        sessionName: sessionData.sessionName,
        sessionKey: sessionData.sessionKey,
        examSet: sessionData.examSet,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        status: 'NOT_STARTED',
        ClassID: sessionData.ClassID
      }

      console.log('🔄 Creating session with data:', formattedData)
      const response = await createSession(formattedData)
      console.log('✅ Session created successfully:', response)
      return response
    },
    onSuccess: (_data, /** @type {SessionData} */ variables) => {
      if (variables && variables.ClassID) {
        console.log('🔄 Invalidating queries for ClassID:', variables.ClassID)
        queryClient.invalidateQueries({ queryKey: ['sessions', variables.ClassID] })
      }
    },
    onError: (error, /** @type {SessionData} */ variables) => {
      console.error('❌ Failed to create session:', {
        error,
        sessionData: variables
      })
    }
  })
}
