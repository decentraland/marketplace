import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import {
  getData,
  getLoading,
  getRequiredPermissions
} from '../../../modules/asset/selectors'
import { RootState } from '../../../modules/reducer'
import {
  FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST,
  fetchSmartWearableRequiredPermissionsRequest
} from '../../../modules/asset/actions'
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
    isLoading: isLoadingType(
      getLoading(state),
      FETCH_SMART_WEARABLE_REQUIRED_PERMISSIONS_REQUEST
    ),
    hasFetched: id in getData(state),
    requiredPermissions: getRequiredPermissions(state, id)
  }
}

const mapDispatchProps = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchRequiredPermissions: (asset: Asset) =>
    dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
})

export default connect(mapState, mapDispatchProps)(RequiredPermissions)
