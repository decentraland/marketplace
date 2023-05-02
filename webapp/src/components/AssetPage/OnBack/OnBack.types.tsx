import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  isFavoritesEnabled: boolean
  onBack: (location?: string) => void
}

export type MapStateProps = Pick<Props, 'isFavoritesEnabled'>
export type MapDispatchProps = Pick<Props, 'onBack'>
