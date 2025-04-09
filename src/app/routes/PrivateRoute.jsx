import ClassDetailsPage from '@features/class-management/ui/view-class'
import Profile from '@features/profile/ui/profile'
import ClassListPage from '@pages/class-management'
import DashboardPage from '@pages/DashboardPage'
import GradingPage from '@pages/GradingPage'
import SessionDetailPage from '@pages/SessionDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import TeacherAdminList from '../../features/admin/ui/teacher-admin-list'
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
        path: '/classes-management/:id',
        element: <ClassDetailsPage />
      },
      {
        path: '/classes-management/:Id/:sessionId/students/:studentId',
        element: <StudentProfilePage />
      },
      {
        path: '/classes-management/:id/session/:sessionId',
        element: <SessionDetailPage />
      },
      {
        path: 'profile/:userId',
        element: <Profile />
      },
      {
        path: '/account-management',
        element: <TeacherAdminList />
      },
      {
        path: 'grading',
        element: <GradingPage />
      }
    ]
  }
]

export default PrivateRoute
