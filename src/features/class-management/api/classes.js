import axios from 'axios'
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_BASE_URL

const handleApiError = (error, message) => {
  if (error.response) {
    console.error(`${message}:`, error.response.data)
    throw new Error(error.response.data.message || 'API Error')
  } else {
    console.error(`${message}:`, error)
    throw new Error('Network Error')
  }
}

export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Error fetching classes')
  }
}
export const fetchClassDetails = async classId => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions?classId=${classId}`)
    const data = await response.json()

    return {
      classInfo: data?.data || [],
      totalSessions: data?.total || 0
    }
  } catch (error) {
    handleApiError(error, `Error fetching details for class ID ${classId}`)
    return { classInfo: [], totalSessions: 0 }
  }
}

export const createClass = async classData => {
  try {
    const response = await axios.post(`${API_BASE_URL}/classes`, classData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Error creating class')
  }
}

export const updateClass = async (classId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/classes/${classId}`, updatedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    handleApiError(error, `Error updating class with ID ${classId}`)
  }
}

export const deleteClass = async classId => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/classes/${classId}`)
    return response.data
  } catch (error) {
    handleApiError(error, `Error deleting class with ID ${classId}`)
  }
}
