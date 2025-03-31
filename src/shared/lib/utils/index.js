import dayjs from 'dayjs'

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
  const statusClasses = {
    Completed: 'bg-status-completed-bg text-status-completed-text',
    'In Progress': 'bg-status-in-progress-bg text-status-in-progress-text',
    Pending: 'bg-status-pending-bg text-status-pending-text'
  }
  return statusClasses[status] || 'bg-status-default-bg text-status-default-text'
}
