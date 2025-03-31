import * as yup from 'yup'

export const editSessionSchema = yup.object().shape({
  name: yup.string().required('Session name is required'),
  key: yup.string().required('Session key is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date')
})
