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
    const response = await axiosInstance.post(`/sessions/${sessionId}/publish`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to publish session results')
  }
}

export function getSessionsByClassId(classId) {
  return axiosInstance.get('/sessions', { params: { classId } })
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

export const deleteSession = async sessionId => {
  try {
    const response = await axiosInstance.delete(`/sessions/${sessionId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete session')
  }
}
