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
        delete headers.Authorization // Remove the Authorization header
        return data
      }
    ]
  })
}

// Example usage:
getStudentsBySessionId('1db40057-623d-4597-b267-520dedd4dc76')
  .then(response => console.log(response.data))
  .catch(error => console.error(error))
