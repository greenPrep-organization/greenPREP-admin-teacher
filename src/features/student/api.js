import axiosInstance from '@shared/config/axios'

export function getStudentsBySessionId(SessionId) {
  return axiosInstance.get('sessions', {
    params: { SessionId }
  })
}

export const getPendingSessionRequests = async sessionId => {
  try {
    const response = await axiosInstance.get(`/session-requests/${sessionId}`, {
      params: { status: 'pending' }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending session requests')
  }
}
