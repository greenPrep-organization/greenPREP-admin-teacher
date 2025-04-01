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
        path: 'student',
        element: <StudentProfilePage />
      },
      {
        path: 'session',
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
