import { Dispatch } from 'redux'
import { ClearAssetError, FetchSmartWearableRequiredPermissionsRequestAction } from '../../../modules/asset/actions'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  error?: string
  requiredPermissions: string[]
  isLoading: boolean
  hasFetched: boolean
  onClearError: () => void
  onFetchRequiredPermissions: (asset: Asset) => void
}

export type OwnProps = Pick<Props, 'asset'>
export type MapStateProps = Pick<Props, 'requiredPermissions' | 'isLoading' | 'hasFetched' | 'error'>
export type MapDispatchProps = Pick<Props, 'onFetchRequiredPermissions' | 'onClearError'>
export type MapDispatch = Dispatch<FetchSmartWearableRequiredPermissionsRequestAction | ClearAssetError>
