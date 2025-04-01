// import { lazy } from 'react';
import ClassDetailPage from '@pages/ClassDetailPage'
import StudentProfilePage from '@pages/StudentProfilePage'
import ClassList from '@pages/class-management/index'
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
        path: 'classes-management',
        element: <ClassList />
      },
      {
        path: 'student',
        element: <StudentProfilePage />
      },
      {
        path: 'teacher',
        element: <TeacherProfile userId={1} />
      }
    ]
  }
]

export default PrivateRoute
