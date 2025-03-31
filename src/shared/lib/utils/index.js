
import dayjs from 'dayjs'
import { COLORS } from '@shared/lib/constants/colors'

export const formatDateTime = dateString => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

export const isEmpty = value => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const createSlug = text => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getStatusColor = status => {
  const statusColors = {
    Completed: { bg: COLORS.STATUS_COMPLETED_BG, text: COLORS.STATUS_COMPLETED_TEXT },
    'In Progress': { bg: COLORS.STATUS_IN_PROGRESS_BG, text: COLORS.STATUS_IN_PROGRESS_TEXT },
    Pending: { bg: COLORS.STATUS_PENDING_BG, text: COLORS.STATUS_PENDING_TEXT }
  }
  return statusColors[status] || { bg: COLORS.STATUS_DEFAULT_BG, text: COLORS.STATUS_DEFAULT_TEXT }
}

const formatDate = date => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export { formatDate }

