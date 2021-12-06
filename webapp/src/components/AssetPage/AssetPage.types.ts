import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  onBack: () => void
}

export type MapDispatchProps = Pick<Props, 'onBack'>
