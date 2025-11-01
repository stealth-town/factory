import { DAPP_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function DappUiProgramExplorerLink() {
  return <AppExplorerLink address={DAPP_PROGRAM_ADDRESS} label={ellipsify(DAPP_PROGRAM_ADDRESS)} />
}
