import { useAuth } from '../data-access/use-auth'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function LoginPage() {
  const { connect, connected, publicKey } = useWalletUi()
  const { login } = useAuth()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error(error)
    }
  }

  const handleLogin = async () => {
    try {
      await login.mutateAsync()
      toast.success('Successfully signed in!')
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
          {!connected ? (
            <Button
              onClick={handleConnect}
              className="w-full"
              size="lg"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Connected Wallet</p>
                <p className="font-mono text-sm break-all">{publicKey}</p>
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

