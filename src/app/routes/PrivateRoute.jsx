// import { lazy } from 'react';
import ClassDetailPage from '@pages/ClassDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import SessionDetailPage from '../../pages/SessionDetailPage'

import TeacherProfile from '../../features/profile/ui/teacher-profile'
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
        path: 'student',
        element: <StudentProfilePage />
      },
      {
        path: 'session',
        element: <SessionDetailPage />
      },
      {
        path: 'teacher',
        element: <TeacherProfile userId={1} />
      }
    ]
  }
]

export default PrivateRoute
