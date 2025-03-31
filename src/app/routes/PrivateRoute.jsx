// import { lazy } from 'react';
import StudentProfilePage from '@pages/StudentProfilePage'
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
        path: 'student',
        element: <StudentProfilePage />
      }
    ]
  }
]

export default PrivateRoute
