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
    const response = await axiosInstance.patch(`/sessions/${sessionId}/participants/${participantId}`, {
      level
    })
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
  return axiosInstance.get('sessions', {
    params: { classId }
  })
}

export const getUserInfo = async userId => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user information')
  }
}

export const getUserSessionHistory = async userId => {
  try {
    const response = await axiosInstance.get(`/session-participants/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session history')
  }
}
