import { connect } from 'react-redux'
import { getContract } from '../../modules/contract/selectors'
import { RootState } from '../../modules/reducer'
import { Contract } from '../../modules/vendor/services'
import LegacyNFTPage from './LegacyNFTPage'
import { MapStateProps, OwnProps } from './LegacyNFTPage.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  match: ownProps.match,
  history: ownProps.history,
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

export default connect(mapState)(LegacyNFTPage)
