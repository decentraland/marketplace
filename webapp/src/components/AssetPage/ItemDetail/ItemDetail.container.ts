import { connect } from 'react-redux'
import { getIsBidsOffChainEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import ItemDetail from './ItemDetail'
import { MapStateProps } from './ItemDetail.types'

const mapState = (state: RootState): MapStateProps => ({
  isBidsOffchainEnabled: getIsBidsOffChainEnabled(state)
})

export default connect(mapState)(ItemDetail)
