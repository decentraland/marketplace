import { Asset } from '../../../../modules/asset/types'

export type Props = {
  asset: Asset
  buyWithCardClassName?: string
}

export type OwnProps = Pick<Props, 'asset'>
