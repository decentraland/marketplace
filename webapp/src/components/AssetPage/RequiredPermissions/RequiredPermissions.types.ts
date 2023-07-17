import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  requiredPermissions: string[]
}

export type OwnProps = Pick<Props, 'asset'>
export type MapStateProps = Pick<Props, 'requiredPermissions'>
