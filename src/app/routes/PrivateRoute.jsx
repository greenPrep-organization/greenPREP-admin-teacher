import ClassDetailsPage from '@features/class-management/ui/view-class'
import Profile from '@features/profile/ui/profile'
import ClassListPage from '@pages/class-management'
import GradingPage from '@pages/GradingPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import SessionDetailPage from '@pages/SessionDetailPage'
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
        path: 'classes-management',
        element: <ClassListPage />
      },
      {
        path: 'classes-management/:id',
        element: <ClassDetailsPage />
      },
      {
        path: 'student/:userId',
        element: <StudentProfilePage />
      },
      {
        path: 'session/:sessionId',
        element: <SessionDetailPage />
      },
      {
        path: 'profile/:userId',
        element: <Profile />
      },
      {
        path: 'grading',
        element: <GradingPage />
      }
    ]
  }
]

export default PrivateRoute
