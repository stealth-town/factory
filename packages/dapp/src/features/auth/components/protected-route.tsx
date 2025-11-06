import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStatus } from '../data-access/use-auth-status'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * ProtectedRoute component
 * Redirects to /login if user is not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStatus()

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

