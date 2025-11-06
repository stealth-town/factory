import { useRoutes } from 'react-router'
import { lazy } from 'react'
import { ProtectedRoute } from '@/features/auth/components/protected-route'

const AccountDetailFeature = lazy(() => import('@/features/account/account-feature-detail.tsx'))
const AccountIndexFeature = lazy(() => import('@/features/account/account-feature-index.tsx'))
const DappFeature = lazy(() => import('@/features/dapp/dapp-feature'))
const DashboardFeature = lazy(() => import('@/features/dashboard/dashboard-feature'))
const LoginPage = lazy(() => import('@/features/auth/ui/login-page'))

export function AppRoutes() {
  return useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      index: true,
      element: (
        <ProtectedRoute>
          <DashboardFeature />
        </ProtectedRoute>
      ),
    },
    {
      path: 'account',
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AccountIndexFeature />
            </ProtectedRoute>
          ),
        },
        {
          path: ':address',
          element: (
            <ProtectedRoute>
              <AccountDetailFeature />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: 'dapp',
      element: (
        <ProtectedRoute>
          <DappFeature />
        </ProtectedRoute>
      ),
    },
  ])
}
