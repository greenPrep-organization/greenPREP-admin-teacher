// import { lazy } from 'react';
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
        path: 'student',
        element: <StudentProfilePage />
      },
      {
        path: 'Session',
        element: <SessionDetailPage />
      }
    ]
  }
]

export default PrivateRoute
