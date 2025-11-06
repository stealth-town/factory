import { useRoutes } from 'react-router'
import { lazy } from 'react'

const AccountDetailFeature = lazy(() => import('@/features/account/account-feature-detail.tsx'))
const AccountIndexFeature = lazy(() => import('@/features/account/account-feature-index.tsx'))
const DappFeature = lazy(() => import('@/features/dapp/dapp-feature'))
const DashboardFeature = lazy(() => import('@/features/dashboard/dashboard-feature'))
const LoginPage = lazy(() => import('@/features/auth/ui/login-page'))

export function AppRoutes() {
  return useRoutes([
    { index: true, element: <DashboardFeature /> },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'account',
      children: [
        { index: true, element: <AccountIndexFeature /> },
        { path: ':address', element: <AccountDetailFeature /> },
      ],
    },
    {
      path: 'dapp',
      element: <DappFeature />,
    },
  ])
}
