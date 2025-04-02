import axiosInstance from '@shared/config/axios'

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
    const response = await axiosInstance.get('/classes')
    return response.data
  } catch (error) {
    handleApiError(error, 'Error fetching classes')
  }
}

export const fetchClassDetails = async classId => {
  try {
    const response = await axiosInstance.get(`/sessions?classId=${classId}`)
    return {
      classInfo: response.data?.data || [],
      totalSessions: response.data?.total || 0
    }
  } catch (error) {
    handleApiError(error, `Error fetching details for class ID ${classId}`)
    return { classInfo: [], totalSessions: 0 }
  }
}

export const createClass = async classData => {
  try {
    const response = await axiosInstance.post('/classes', classData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Error creating class')
  }
}

export const updateClass = async (classId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/classes/${classId}`, updatedData)
    return response.data
  } catch (error) {
    handleApiError(error, `Error updating class with ID ${classId}`)
  }
}

export const deleteClass = async classId => {
  try {
    const response = await axiosInstance.delete(`/classes/${classId}`)
    return response.data
  } catch (error) {
    handleApiError(error, `Error deleting class with ID ${classId}`)
  }
}
