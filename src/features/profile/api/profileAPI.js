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
    queryFn: () => fetchUserProfile(userId),
    placeholderData: {
      email: 'khanh1@example.com',
      firstName: 'Khanh',
      lastName: 'Minh',
      phone: '123456789',
      role: ['teacher'],
      userId: '8f420964-edbf-44e6-ac0b-096c59bdf2db',
      classes: ['English', 'History']
    },
    enabled: !!userId
  })
}
