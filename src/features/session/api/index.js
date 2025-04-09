import axiosInstance from '@shared/config/axios'

export const getSessionDetail = async sessionId => {
  try {
    const response = await axiosInstance.get(`/sessions/${sessionId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session details')
  }
}

export const getSessionParticipants = async (sessionId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/session-participants/${sessionId}`, { params })
    console.log(response)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch participants')
  }
}

export const updateParticipantLevel = async (sessionId, participantId, level) => {
  try {
    const response = await axiosInstance.patch(`/sessions/${sessionId}/participants/${participantId}`, { level })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update participant level')
  }
}

export const publishSessionResults = async sessionId => {
  try {
    const response = await axiosInstance.post(`/sessions/${sessionId}/publish`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to publish session results')
  }
}

export function getSessionsByClassId(classId) {
  return axiosInstance.get('/sessions', { params: { classId } })
}

export const createSession = async sessionData => {
  try {
    console.log(' Creating session with data:', sessionData)

    if (!sessionData.ClassID) {
      throw new Error('ClassID is required')
    }

    if (!sessionData.examSet) {
      throw new Error('Exam set is required')
    }

    const response = await axiosInstance.post('/sessions', {
      ...sessionData,
      ClassID: sessionData.ClassID
    })

    if (response.status !== 200) {
      throw new Error(`Failed to create session: ${response.statusText}`)
    }

    return response.data
  } catch (error) {
    console.error('Error creating session:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}
