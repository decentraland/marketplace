import { RentalListing } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../modules/asset/types'
import { clearBidError, placeBidRequest } from '../../../modules/bid/actions'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'

export type Props = {
  asset: Asset
  rental: RentalListing | null
  wallet: Wallet | null
  isBidsOffchainEnabled: boolean
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
  onClearBidError: typeof clearBidError
  isPlacingBid: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
} & WithAuthorizedActionProps
