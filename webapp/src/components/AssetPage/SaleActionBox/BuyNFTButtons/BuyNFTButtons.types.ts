import { Asset } from '../../../../modules/asset/types'

export type Props = {
  asset: Asset
}

export type OwnProps = Pick<Props, 'asset'>
