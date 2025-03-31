import PrivateRoute from '@app/routes/PrivateRoute'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import NotFound from '@pages/NotFoundPage'
import Layout from '@shared/ui/Layout/Layout'
import PublicRoute from '@app/routes/PublicRoute'
import LoginPage from '@pages/LoginPage'

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/',
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      errorElement: <NotFound />,
      children: [...PublicRoute, ...PrivateRoute]
    }
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    }
  }
)

const RouteProvider = () => {
  return (
    <RouterProvider
      future={{
        v7_startTransition: true
      }}
      router={router}
    />
  )
}
export default RouteProvider
