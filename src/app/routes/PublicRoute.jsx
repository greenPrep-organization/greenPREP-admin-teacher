import DashboardPage from '@pages/DashboardPage'
import SessionPage from '@pages/SessionPage'

const PublicRoute = [
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/session',
    element: <SessionPage />
  }
]

export default PublicRoute
