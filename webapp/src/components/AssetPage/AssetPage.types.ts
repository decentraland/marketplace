import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  isRentalsEnabled: boolean
  onBack: (location?: string) => void
}

export type MapStateProps = Pick<Props, 'isRentalsEnabled'>
export type MapDispatchProps = Pick<Props, 'onBack'>
