import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  isBuyCrossChainEnabled: boolean
}

export type OwnProps = Pick<Props, 'type'>
export type MapStateProps = Pick<Props, 'isBuyCrossChainEnabled'>
