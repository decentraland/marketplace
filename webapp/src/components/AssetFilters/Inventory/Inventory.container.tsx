import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getNetwork } from '../../../modules/routing/selectors'
import { Inventory } from './Inventory'
import { MapStateProps, OwnProps } from './Inventory.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values = {} } = ownProps
  return {
    network: 'network' in values ? values.network : getNetwork(state)
  }
}

export default connect(mapState)(Inventory)
