import { changeUserPassword, fetchUserProfile, updateUserProfile } from '@features/profile/api'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId
  })
}

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile
  })
}

export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: changeUserPassword
  })
}
