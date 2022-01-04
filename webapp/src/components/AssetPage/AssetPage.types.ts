import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  onBack: (location?: string) => void
}

export type MapDispatchProps = Pick<Props, 'onBack'>
