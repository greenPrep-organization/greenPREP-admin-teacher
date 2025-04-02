import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = 'https://dev-api-greenprep.onrender.com'
const accessToken = localStorage.getItem('access_token')

const fetchUserProfile = async userId => {
  try {
    console.log(`Fetching user profile for userId: ${userId}`)
    const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => await fetchUserProfile(userId),
    enabled: !!userId && !!accessToken
  })
}
