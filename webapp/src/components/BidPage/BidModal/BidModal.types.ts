import { RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { NFT } from '../../../modules/nft/types'
import { clearBidError, placeBidRequest } from '../../../modules/bid/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  wallet: Wallet | null
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
  onClearBidError: typeof clearBidError
  isPlacingBid: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
} & WithAuthorizedActionProps
