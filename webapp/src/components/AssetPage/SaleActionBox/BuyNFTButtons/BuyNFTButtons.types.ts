import { Network } from '@dcl/schemas'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  contractAddress: string
  network: Network
  tokenId?: string
  itemId?: string
  buyWithCardClassName?: string
}

export type OwnProps = Props
