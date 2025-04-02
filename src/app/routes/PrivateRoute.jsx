import ClassListPage from '@pages/class-management'
import ClassDetailPage from '@pages/ClassDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import ClassDetailsPage from '@features/class-management/ui/view-class'
import TeacherProfile from '../../features/profile/ui/teacher-profile'
import SessionDetailPage from '../../pages/SessionDetailPage'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import GradingPage from '@pages/GradingPage'

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
        path: 'teacher',
        element: <TeacherProfile />
      },
      {
        path: 'grading',
        element: <GradingPage />
      }
    ]
  }
]

export default PrivateRoute
