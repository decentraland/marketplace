import { AssetType } from '../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  onClick: () => void
}

export type MapDispatchProps = Pick<Props, 'onClick'>
export type OwnProps = Pick<Props, 'assetType'>
