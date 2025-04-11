import { updateUser } from '@app/providers/reducer/auth/authSlice'
import { changeUserPassword, fetchUserProfile, updateUserProfile } from '@features/profile/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId
  })
}

export const useUpdateUserProfile = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: response => {
      const updatedUser = response.data
      dispatch(updateUser(updatedUser))
    },
    onError: error => {
      console.error('Update profile failed:', error)
    }
  })
}

export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: changeUserPassword
  })
}
