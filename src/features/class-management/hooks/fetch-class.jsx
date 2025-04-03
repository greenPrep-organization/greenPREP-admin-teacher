import { useQuery } from '@tanstack/react-query'
import { fetchClasses, fetchClassDetails } from '@features/class-management/api'

export const useFetchClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useFetchClassDetails = classes => {
  return useQuery({
    queryKey: ['classDetails', classes.map(cls => cls.ID)],
    queryFn: async () => {
      const data = await Promise.all(classes.map(cls => fetchClassDetails(cls.ID)))
      return data
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: classes.length > 0
  })
}
