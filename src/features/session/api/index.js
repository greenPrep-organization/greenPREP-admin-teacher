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
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch participants')
  }
}

export const updateParticipantLevelById = async (id, level) => {
  try {
    const response = await axiosInstance.put(`/session-participants/${id}/level`, {
      newLevel: level
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update participant level by ID')
  }
}

export const publishSessionResults = async sessionId => {
  try {
    const response = await axiosInstance({
      method: 'put',
      url: '/session-participants/publish-scores',
      data: {
        sessionId
      }
    })
    return response.data
  } catch (error) {
    console.error('Publish error details:', error.response?.data)
    if (error.response?.status === 500) {
      throw new Error('Server error: ' + (error.response?.data?.message || 'Internal server error'))
    }
    throw new Error(error.response?.data?.message || 'Failed to publish session results')
  }
}

export function getSessionsByClassId({ classId, sessionName = '', status = '', page, limit }) {
  return axiosInstance({
    method: 'get',
    url: '/sessions',
    params: {
      classId,
      sessionName,
      status,
      page,
      limit
    }
  })
}

export const createSession = async data => {
  try {
    const response = await axiosInstance.post('/sessions', data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create session')
  }
}

export const getTestSets = async () => {
  const response = await axiosInstance.get('/topics')
  return response.data
}
export const generationKey = async () => {
  const response = await axiosInstance.get('/sessions/generate-key')
  return response.data
}

export const deleteSession = async sessionId => {
  try {
    const response = await axiosInstance.delete(`/sessions/${sessionId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete session')
  }
}

export const updateSession = async (sessionId, data) => {
  try {
    const response = await axiosInstance.put(`/sessions/${sessionId}`, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update session')
  }
}

export const publishParticipantScores = async sessionId => {
  try {
    const response = await axiosInstance.put(`/session-participants/publish-scores`, {
      sessionId
    })
    return response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to publish participant scores')
  }
}
