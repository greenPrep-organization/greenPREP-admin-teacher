import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const getSessionDetail = async sessionId => {
  try {
    const response = await axios.get(`${BASE_URL}/sessions/${sessionId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session details')
  }
}

export const getSessionParticipants = async (sessionId, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/session-participants/${sessionId}`, { params })
    console.log(response)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch participants')
  }
}

export const updateParticipantLevel = async (sessionId, participantId, level) => {
  try {
    const response = await axios.patch(`${BASE_URL}/sessions/${sessionId}/participants/${participantId}`, {
      level
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update participant level')
  }
}

export const publishSessionResults = async sessionId => {
  try {
    const response = await axios.post(`${BASE_URL}/sessions/${sessionId}/publish`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to publish session results')
  }
}

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
