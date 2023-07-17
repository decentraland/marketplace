import { connect } from 'react-redux'
import { getRequiredPermissions } from '../../../modules/asset/selectors'
import { RootState } from '../../../modules/reducer'
import RequiredPermissions from './RequiredPermissions'
import { OwnProps, MapStateProps } from './RequiredPermissions.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  requiredPermissions: getRequiredPermissions(state, ownProps.asset.id)
})

export default connect(mapState)(RequiredPermissions)
