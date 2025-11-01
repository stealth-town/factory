import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { DappUiProgramExplorerLink } from './ui/dapp-ui-program-explorer-link'
import { DappUiCreate } from './ui/dapp-ui-create'
import { DappUiProgram } from '@/features/dapp/ui/dapp-ui-program'

export default function DappFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="Dapp" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <DappUiProgramExplorerLink />
        </p>
        <DappUiCreate account={account} />
      </AppHero>
      <DappUiProgram />
    </div>
  )
}
