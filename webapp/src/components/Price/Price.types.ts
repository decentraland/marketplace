import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  price?: string
  title?: string
}

export type MapStateProps = Pick<Props, 'price'>
export type OwnProps = Pick<Props, 'asset' | 'title'>
