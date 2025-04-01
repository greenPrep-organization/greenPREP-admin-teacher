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
