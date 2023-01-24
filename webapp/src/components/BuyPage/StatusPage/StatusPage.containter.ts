import { connect } from 'react-redux'
import { getNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/selectors'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, OwnProps } from './StatusPage.types'
import StatusPage from './StatusPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { contractAddress, tokenId } = ownProps.match.params

  return {
    purchase: getNFTPurchase(state, contractAddress, tokenId)
  }
}

export default connect(mapState)(StatusPage)
