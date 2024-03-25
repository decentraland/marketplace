import { connect } from 'react-redux'
import { clearAssetError, fetchSmartWearableRequiredPermissionsRequest } from '../../../modules/asset/actions'
import { getAssetData, getError, getRequiredPermissions, isFetchingRequiredPermissions } from '../../../modules/asset/selectors'
import { Asset } from '../../../modules/asset/types'
import { RootState } from '../../../modules/reducer'
import RequiredPermissions from './RequiredPermissions'
import { OwnProps, MapStateProps, MapDispatchProps, MapDispatch } from './RequiredPermissions.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { id } = ownProps.asset

  return {
    isLoading: isFetchingRequiredPermissions(state, id),
    hasFetched: 'requiredPermissions' in getAssetData(state, id),
    error: getError(state) ?? undefined,
    requiredPermissions: getRequiredPermissions(state, id)
  }
}

const mapDispatchProps = (dispatch: MapDispatch): MapDispatchProps => ({
  onClearError: () => dispatch(clearAssetError()),
  onFetchRequiredPermissions: (asset: Asset) => dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
})

export default connect(mapState, mapDispatchProps)(RequiredPermissions)
