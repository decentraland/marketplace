import { Network } from '@dcl/schemas'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'

export type Props = {
  price: string
  network: Network
  useCredits: boolean
  credits?: CreditsResponse
  /**
   * The trade backing this price, when there is one. Its received asset type is the only thing that
   * says whether `price` is MANA wei or USD wei — see `modules/trade/denomination`. Omit it for
   * prices that cannot be USD-pegged (legacy on-chain orders, collection-store mints, rentals).
   */
  tradeId?: string
  className?: string
}

export type MapStateProps = {
  credits?: CreditsResponse
}

export type OwnProps = Omit<Props, 'credits'>
