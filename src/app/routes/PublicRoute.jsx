import DashboardPage from '@pages/DashboardPage'
import TextPage from '@pages/TextPage'

const PublicRoute = [
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/text',
    element: <TextPage />
  }
]

export default PublicRoute
