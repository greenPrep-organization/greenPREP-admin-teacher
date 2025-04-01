import axios from 'axios'

const API_BASE_URL = 'https://dev-api-greenprep.onrender.com/api/classes'

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
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    handleApiError(error, 'Error fetching classes')
  }
}

export const fetchClassById = async classId => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${classId}`)
    return response.data?.data || {}
  } catch (error) {
    handleApiError(error, `Error fetching class with ID ${classId}`)
  }
}

export const createClass = async classData => {
  try {
    const response = await axios.post(API_BASE_URL, classData, {
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
    const response = await axios.put(`${API_BASE_URL}/${classId}`, updatedData, {
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
    const response = await axios.delete(`${API_BASE_URL}/${classId}`)
    return response.data
  } catch (error) {
    handleApiError(error, `Error deleting class with ID ${classId}`)
  }
}
