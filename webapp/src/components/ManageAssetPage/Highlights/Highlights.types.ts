import { NFT } from '../../../modules/nft/types'
import { Proximity } from '../../../modules/proximity/types'

export type Props = {
  nft: NFT
  proximities: Record<string, Proximity>
  className?: string
}

export type MapStateProps = Pick<Props, 'proximities'>
export type OwnProps = Pick<Props, 'nft' | 'className'>
