import { connect } from 'react-redux'
import { getNFTPurchase } from 'decentraland-dapps/dist/modules/gateway/selectors'
import { RootState } from '../../../modules/reducer'
import StatusPage from './StatusPage'
import { MapStateProps, OwnProps } from './StatusPage.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { contractAddress, tokenId } = ownProps.match.params

  return {
    purchase: contractAddress && tokenId ? getNFTPurchase(state, contractAddress, tokenId) : null
  }
}

export default connect(mapState)(StatusPage)
