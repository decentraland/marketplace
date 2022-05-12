import { NFT } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  wearable: Required<NFT['data']>['wearable']
  assetType: AssetType
}

export type OwnProps = Pick<Props, 'wearable' | 'assetType'>
