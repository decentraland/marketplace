import { connect } from 'react-redux'
import {
  getAssetData,
  getRequiredPermissions,
  isFetchingRequiredPermissions
} from '../../../modules/asset/selectors'
import { RootState } from '../../../modules/reducer'
import { fetchSmartWearableRequiredPermissionsRequest } from '../../../modules/asset/actions'
import { Asset } from '../../../modules/asset/types'
import RequiredPermissions from './RequiredPermissions'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './RequiredPermissions.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { id } = ownProps.asset

  return {
    isLoading: isFetchingRequiredPermissions(state, id),
    hasFetched: 'requiredPermissions' in getAssetData(state, id),
    requiredPermissions: getRequiredPermissions(state, id)
  }
}

const mapDispatchProps = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchRequiredPermissions: (asset: Asset) =>
    dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
})

export default connect(mapState, mapDispatchProps)(RequiredPermissions)
