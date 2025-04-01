import ClassDetailsPage from '@features/class-management/ui/view-class'
import Profile from '@features/profile/ui/profile'
import ClassListPage from '@pages/class-management'
import ClassDetailPage from '@pages/ClassDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import SessionDetailPage from '../../pages/SessionDetailPage'
import { ProtectedRoute } from './ProtectedRoute.jsx'

const PrivateRoute = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'homepage',
        element: 'homepage'
      },
      {
        path: 'classes',
        element: <ClassDetailPage />
      },
      {
        path: 'classes-management',
        element: <ClassListPage />
      },
      {
        path: 'classes-management/:id',
        element: <ClassDetailsPage />
      },
      {
        path: 'student',
        element: <StudentProfilePage />
      },
      {
        path: 'session/:sessionId',
        element: <SessionDetailPage />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]

export default PrivateRoute
