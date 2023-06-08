import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  onBack: (location?: string) => void
}

export type MapDispatchProps = Pick<Props, 'onBack'>
