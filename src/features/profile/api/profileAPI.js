import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = 'https://dev-api-greenprep.onrender.com'

const fetchUserProfile = async userId => {
  const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}`)
  return data
}

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (userId === '1') {
        return {
          id: 1,
          firstName: 'Alice',
          lastName: 'Smith',
          personalEmail: 'alice.smith@example.com',
          phone: '987654321',
          roleIDs: ['teacher'],
          classes: ['English', 'History']
        }
      } else {
        return await fetchUserProfile(userId)
      }
    }
  })
}
