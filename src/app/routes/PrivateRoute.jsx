// import { lazy } from 'react';
import ClassDetailPage from '../../pages/ClassdetailPage'
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
      }
    ]
  }
]

export default PrivateRoute
