import { RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'
import { placeBidRequest } from '../../../modules/bid/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { WithAuthorizedActionProps } from '../../HOC/withAuthorizedAction'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  wallet: Wallet | null
  onNavigate: (path: string) => void
  onPlaceBid: typeof placeBidRequest
  isPlacingBid: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
} & WithAuthorizedActionProps
