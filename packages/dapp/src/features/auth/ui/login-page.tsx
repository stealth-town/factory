import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../data-access/use-auth'
import { useAuthStatus } from '../data-access/use-auth-status'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'

export default function LoginPage() {
	const navigate = useNavigate()
	const { connected, account } = useWalletUi()
	const { login } = useAuth()
	const { isAuthenticated, isLoading } = useAuthStatus()

	if (!isLoading && isAuthenticated) {
		return <Navigate to="/" replace />
	}

	const handleLogin = async () => {
		try {
			await login.mutateAsync()
			toast.success('Successfully signed in!')
			navigate('/', { replace: true })
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to sign in')
			console.error(error)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Welcome to Launch Solana</h1>
					<p className="text-muted-foreground">
						Connect your wallet to sign in and start playing
					</p>
				</div>

				<div className="space-y-4">
					<WalletDropdown />

					{connected && account && (
						<div className="space-y-4">
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="text-sm text-muted-foreground">Connected Wallet</p>
								<p className="font-mono text-sm break-all">{account.address}</p>
							</div>

							<Button
								onClick={handleLogin}
								disabled={login.isPending}
								className="w-full"
								size="lg"
							>
								{login.isPending ? 'Signing in...' : 'Sign In'}
							</Button>
						</div>
					)}
				</div>

				{login.isError && (
					<div className="rounded-lg border border-destructive bg-destructive/10 p-4">
						<p className="text-sm text-destructive">
							{login.error instanceof Error ? login.error.message : 'An error occurred'}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}