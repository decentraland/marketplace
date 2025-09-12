import { ChainId, Network } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'

export type Props = {
  chainId: ChainId
  network: Network
  isBuyWithCardPage: boolean
  onSwitchNetwork: ActionFunction<typeof switchNetworkRequest>
}

export type PriceTooLowContainerProps = Pick<Props, 'chainId' | 'network'>
