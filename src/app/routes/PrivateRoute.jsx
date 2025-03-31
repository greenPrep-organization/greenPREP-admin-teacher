// import { lazy } from 'react';
import ClassDetailPage from '@/pages/ClassDetailPage'
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
        path: 'teacher',
        element: <TeacherProfile userId={123} />
      }
    ]
  }
]

export default PrivateRoute
