import axiosInstance from '@shared/config/axios'

export function getSessionsByClassId(classId) {
  return axiosInstance.request({
    url: 'sessions',
    method: 'GET',
    params: {
      classId
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
getSessionsByClassId('1db40057-623d-4597-b267-520dedd4dc76')
  .then(response => console.log(response.data))
  .catch(error => console.error(error))
