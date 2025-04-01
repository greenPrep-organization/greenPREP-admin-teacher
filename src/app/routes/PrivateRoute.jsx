// import { lazy } from 'react';
import ClassDetailPage from '@/pages/ClassDetailPage'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import SessionPage from '@features/session/ui/session-page.jsx'

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
        path: 'sessions/:sessionId',
        element: <SessionPage />
      }
    ]
  }
]

export default PrivateRoute
