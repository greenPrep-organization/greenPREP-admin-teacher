import ClassDetailsPage from '@features/class-management/ui/view-class'
import Profile from '@features/profile/ui/profile'
import ClassListPage from '@pages/class-management'
import DashboardPage from '@pages/DashboardPage'
import GradingPage from '@pages/GradingPage'
import SessionDetailPage from '@pages/SessionDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import AdminTeachers from '../../features/admin/ui/page-teacher'
import { ProtectedRoute } from './ProtectedRoute.jsx'

const PrivateRoute = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />
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
      },
      {
        path: 'admin',
        element: <AdminTeachers />
      }
    ]
  }
]

export default PrivateRoute
