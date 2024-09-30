import { connect } from 'react-redux'
import { getIsOffchainPublicNFTOrdersEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import ListingsTable from './ListingsTable'
import { MapStateProps } from './ListingsTable.types'

const mapState = (state: RootState): MapStateProps => ({
  isOffchainPublicNFTOrdersEnabled: getIsOffchainPublicNFTOrdersEnabled(state)
})

export default connect(mapState)(ListingsTable)
