import { Dispatch } from 'redux'
import { Asset } from '../../../modules/asset/types'
import { FetchSmartWearableRequiredPermissionsRequestAction } from '../../../modules/asset/actions'

export type Props = {
  asset: Asset
  requiredPermissions: string[]
  isLoading: boolean
  hasFetched: boolean
  onFetchRequiredPermissions: (asset: Asset) => void
}

export type OwnProps = Pick<Props, 'asset'>
export type MapStateProps = Pick<
  Props,
  'requiredPermissions' | 'isLoading' | 'hasFetched'
>
export type MapDispatchProps = Pick<Props, 'onFetchRequiredPermissions'>
export type MapDispatch = Dispatch<
  FetchSmartWearableRequiredPermissionsRequestAction
>
