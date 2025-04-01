import axiosInstance from '@shared/config/axios'

export function getStudentsBySessionId(SessionId) {
  return axiosInstance.request({
    url: 'sessions',
    method: 'GET',
    params: {
      SessionId
    },
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      (data, headers) => {
        delete headers.Authorization
        return data
      }
    ]
  })
}

export const getPendingSessionRequests = async sessionId => {
  try {
    const response = await axiosInstance.request({
      url: `/session-requests/${sessionId}`,
      method: 'GET',
      params: { status: 'pending' },
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [
        (data, headers) => {
          delete headers.Authorization
          return data
        }
      ]
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending session requests')
  }
}
