import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  isFavoritesEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isFavoritesEnabled'>
