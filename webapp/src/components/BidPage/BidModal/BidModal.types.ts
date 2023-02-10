import { RentalListing } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { placeBidRequest } from '../../../modules/bid/actions'
import { getContract } from '../../../modules/contract/selectors'
import { NFT } from '../../../modules/nft/types'
import { Contract } from '../../../modules/vendor/services'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  wallet: Wallet | null
  authorizations: Authorization[]
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
  isPlacingBid: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
}
