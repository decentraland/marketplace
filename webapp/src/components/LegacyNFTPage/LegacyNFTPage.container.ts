import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'
import { MapStateProps, OwnProps } from './LegacyNFTPage.types'
import LegacyNFTPage from './LegacyNFTPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  match: ownProps.match,
  history: ownProps.history,
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

export default connect(mapState)(LegacyNFTPage)
